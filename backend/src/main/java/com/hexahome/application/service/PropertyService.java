package com.hexahome.application.service;

import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ForbiddenException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.application.dto.property.CreatePropertyRequest;
import com.hexahome.application.dto.property.PropertyDetailDto;
import com.hexahome.application.dto.property.PropertyFilterRequest;
import com.hexahome.application.dto.property.PropertySummaryDto;
import com.hexahome.persistence.entity.*;
import com.hexahome.persistence.repository.*;
import com.hexahome.persistence.specification.PropertySpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PropertyService implements com.hexahome.application.port.in.PropertyUseCase {

    private static final Logger log = LoggerFactory.getLogger(PropertyService.class);
    private static final String SHORT_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();

    private final PropertyRepository propertyRepository;
    private final CityRepository cityRepository;
    private final LocalityRepository localityRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AmenityRepository amenityRepository;

    public PropertyService(
            PropertyRepository propertyRepository,
            CityRepository cityRepository,
            LocalityRepository localityRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            AmenityRepository amenityRepository) {
        this.propertyRepository = propertyRepository;
        this.cityRepository = cityRepository;
        this.localityRepository = localityRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.amenityRepository = amenityRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertySummaryDto> searchProperties(PropertyFilterRequest filter) {
        int page = Math.max(0, filter != null ? filter.getPage() : 0);
        int size = (filter != null && filter.getSize() > 0) ? Math.min(filter.getSize(), 50) : 12;
        String sortParam = filter != null ? filter.getSort() : "newest";
        Pageable pageable = PageRequest.of(page, size, resolveSort(sortParam));
        Specification<Property> spec = PropertySpecification.build(filter);
        return propertyRepository.findAll(spec, pageable).map(PropertySummaryDto::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyDetailDto getPropertyBySlugOrId(String identifier) {
        Property property = propertyRepository.findBySlugOrShortId(identifier)
                .orElseGet(() -> parseUuid(identifier)
                        .flatMap(propertyRepository::findById)
                        .orElseThrow(() -> new ResourceNotFoundException("Property", "identifier", identifier)));
        return PropertyDetailDto.fromEntity(property);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertySummaryDto> getFeaturedCollection(String citySlug, String adType, int limit) {
        int boundedLimit = (limit <= 0 || limit > 20) ? 6 : limit;
        return propertyRepository.findFeaturedByCityAndAdType(citySlug, adType, PageRequest.of(0, boundedLimit))
                .stream()
                .map(PropertySummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertySummaryDto> getHotDeals(int limit) {
        int boundedLimit = (limit <= 0 || limit > 20) ? 6 : limit;
        Pageable pageable = PageRequest.of(0, boundedLimit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return propertyRepository.findAllByStatusAndIsHotDealTrue("ACTIVE", pageable)
                .map(PropertySummaryDto::fromEntity)
                .getContent();
    }

    @Override
    @Transactional
    public PropertyDetailDto createProperty(UUID ownerId, CreatePropertyRequest request) {
        User owner = resolveOwner(ownerId, request);
        City city = resolveCity(request);
        Locality locality = resolveLocality(city, request);

        Property property = buildPropertyEntity(request, owner, city, locality);
        attachAmenities(property, request.getAmenityIds());
        attachImages(property, request.getImageUrls());
        attachSubtypeDetails(property, request);

        Property saved = propertyRepository.save(property);
        log.info("Property created: id={}, slug={}, ownerPhone={}", saved.getId(), saved.getSlug(), owner.getPhone());
        return PropertyDetailDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public PropertyDetailDto updateProperty(UUID id, UUID requesterId, CreatePropertyRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        validateOwnershipOrAdmin(property, requesterId);

        if (StringUtils.hasText(request.getTitle())) {
            property.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            property.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            property.setPrice(request.getPrice());
        }
        if (request.getDeposit() != null) {
            property.setDeposit(request.getDeposit());
        }
        if (request.getMaintenanceCharges() != null) {
            property.setMaintenanceCharges(request.getMaintenanceCharges());
        }
        property.setMaintenanceIncluded(request.isMaintenanceIncluded());
        if (StringUtils.hasText(request.getAdType())) {
            property.setAdType(request.getAdType().trim().toUpperCase());
        }
        if (StringUtils.hasText(request.getPropertyType())) {
            property.setPropertyType(request.getPropertyType().trim().toUpperCase());
        }
        if (StringUtils.hasText(request.getBhk())) {
            property.setBhk(request.getBhk());
        }
        if (request.getBedrooms() != null) {
            property.setBedrooms(request.getBedrooms());
        }
        if (request.getBathrooms() != null) {
            property.setBathrooms(request.getBathrooms());
        }
        if (request.getBalconies() != null) {
            property.setBalconies(request.getBalconies());
        }
        if (request.getBuiltUpArea() != null) {
            property.setBuiltUpArea(request.getBuiltUpArea());
        }
        if (request.getCarpetArea() != null) {
            property.setCarpetArea(request.getCarpetArea());
        }
        if (StringUtils.hasText(request.getFurnishing())) {
            property.setFurnishing(request.getFurnishing().trim().toUpperCase());
        }
        if (StringUtils.hasText(request.getPreferredTenant())) {
            property.setPreferredTenant(request.getPreferredTenant().trim().toUpperCase());
        }
        if (request.getFacing() != null) {
            property.setFacing(request.getFacing());
        }
        if (request.getFloorNumber() != null) {
            property.setFloorNumber(request.getFloorNumber());
        }
        if (request.getTotalFloors() != null) {
            property.setTotalFloors(request.getTotalFloors());
        }
        if (request.getAvailableFrom() != null) {
            property.setAvailableFrom(request.getAvailableFrom());
        }
        if (StringUtils.hasText(request.getAddress())) {
            property.setAddress(request.getAddress().trim());
        }

        if (request.getAmenityIds() != null) {
            attachAmenities(property, request.getAmenityIds());
        }
        if (request.getImageUrls() != null) {
            property.getImages().clear();
            attachImages(property, request.getImageUrls());
        }
        attachSubtypeDetails(property, request);

        Property saved = propertyRepository.save(property);
        log.info("Property updated: id={}, requesterId={}", saved.getId(), requesterId);
        return PropertyDetailDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteProperty(UUID id, UUID requesterId) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        validateOwnershipOrAdmin(property, requesterId);

        property.setStatus("INACTIVE");
        propertyRepository.save(property);
        log.info("Property marked INACTIVE / deleted: id={}, requesterId={}", id, requesterId);
    }

    private void validateOwnershipOrAdmin(Property property, UUID requesterId) {
        if (requesterId == null) {
            throw new ForbiddenException("Authentication required to modify this property");
        }
        boolean isOwner = property.getOwner() != null && requesterId.equals(property.getOwner().getId());
        if (isOwner) {
            return;
        }

        org.springframework.security.core.Authentication auth =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            for (org.springframework.security.core.GrantedAuthority ga : auth.getAuthorities()) {
                String role = ga.getAuthority();
                if ("ROLE_ADMIN".equals(role)
                        || "ROLE_SUPER_ADMIN".equals(role)
                        || "ROLE_MODERATOR".equals(role)
                        || "SUPER_ADMIN".equals(role)
                        || "MODERATOR".equals(role)) {
                    return;
                }
            }
        }

        throw new ForbiddenException("Access denied: You do not have permission to modify or delete this property listing");
    }

    private User resolveOwner(UUID ownerId, CreatePropertyRequest request) {
        if (ownerId != null) {
            return userRepository.findById(ownerId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));
        }

        String phone = request.getOwnerPhone();
        if (!StringUtils.hasText(phone)) {
            throw new BadRequestException("Owner identification required: provide an authenticated token or ownerPhone");
        }

        String cleanPhone = phone.replaceAll("\\D", "");
        if (cleanPhone.length() > 10) {
            cleanPhone = cleanPhone.substring(cleanPhone.length() - 10);
        }
        if (cleanPhone.length() != 10) {
            throw new BadRequestException("Invalid owner phone number: must be 10 digits");
        }

        final String finalPhone = cleanPhone;
        return userRepository.findByPhone(cleanPhone).orElseGet(() -> {
            User newUser = new User();
            newUser.setPhone(finalPhone);
            newUser.setName(StringUtils.hasText(request.getOwnerName()) ? request.getOwnerName().trim() : "HexaHome Owner");
            newUser.setEmail(request.getOwnerEmail());
            newUser.setVerified(true);
            newUser.setActive(true);
            roleRepository.findByName("ROLE_OWNER").ifPresent(r -> newUser.setRoles(Set.of(r)));
            return userRepository.save(newUser);
        });
    }

    private City resolveCity(CreatePropertyRequest request) {
        if (request.getCityId() != null) {
            return cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("City", "id", request.getCityId()));
        }
        if (StringUtils.hasText(request.getCity())) {
            String slug = request.getCity().trim().toLowerCase().replace(" ", "-");
            return cityRepository.findBySlug(slug)
                    .or(() -> cityRepository.findByNameIgnoreCase(request.getCity().trim()))
                    .orElseThrow(() -> new ResourceNotFoundException("City", "name", request.getCity()));
        }
        throw new BadRequestException("City ID or city name is required");
    }

    private Locality resolveLocality(City city, CreatePropertyRequest request) {
        if (request.getLocalityId() != null) {
            return localityRepository.findById(request.getLocalityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Locality", "id", request.getLocalityId()));
        }
        if (StringUtils.hasText(request.getLocality())) {
            String name = request.getLocality().trim();
            String slug = name.toLowerCase().replace(" ", "-");
            Optional<Locality> existing = localityRepository.findByCityIdAndSlug(city.getId(), slug)
                    .or(() -> localityRepository.findByCityIdAndNameIgnoreCase(city.getId(), name));
            if (existing.isPresent()) {
                return existing.get();
            }
            Locality dynamicLoc = new Locality();
            dynamicLoc.setCity(city);
            dynamicLoc.setName(name);
            dynamicLoc.setSlug(slug);
            dynamicLoc.setLatitude(city.getLatitude());
            dynamicLoc.setLongitude(city.getLongitude());
            return localityRepository.save(dynamicLoc);
        }
        return localityRepository.findAllByCityIdOrderByDisplayOrderAsc(city.getId())
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Locality fallback = new Locality();
                    fallback.setCity(city);
                    fallback.setName("Central " + city.getName());
                    fallback.setSlug("central-" + city.getSlug());
                    fallback.setLatitude(city.getLatitude());
                    fallback.setLongitude(city.getLongitude());
                    return localityRepository.save(fallback);
                });
    }

    private Property buildPropertyEntity(CreatePropertyRequest req, User owner, City city, Locality locality) {
        BigDecimal lat = req.getLatitude() != null ? req.getLatitude()
                : (locality.getLatitude() != null ? locality.getLatitude()
                : (city.getLatitude() != null ? city.getLatitude() : BigDecimal.valueOf(11.0168)));
        BigDecimal lng = req.getLongitude() != null ? req.getLongitude()
                : (locality.getLongitude() != null ? locality.getLongitude()
                : (city.getLongitude() != null ? city.getLongitude() : BigDecimal.valueOf(76.9558)));

        String shortId = generateShortId();
        String locSlug = StringUtils.hasText(locality.getSlug()) ? locality.getSlug() : "central";
        String ctSlug = StringUtils.hasText(city.getSlug()) ? city.getSlug() : "city";
        String slug = generateSlug(req, locSlug, ctSlug, shortId);

        Property property = new Property();
        property.setShortId(shortId);
        property.setSlug(slug);
        property.setOwner(owner);
        property.setCity(city);
        property.setLocality(locality);
        property.setAdType(StringUtils.hasText(req.getAdType()) ? req.getAdType().trim().toUpperCase() : "RENT");
        property.setPropertyType(StringUtils.hasText(req.getPropertyType()) ? req.getPropertyType().trim().toUpperCase() : "FLAT");
        property.setTitle(StringUtils.hasText(req.getTitle()) ? req.getTitle().trim() : "Property in " + locality.getName());
        property.setDescription(req.getDescription());
        property.setPrice(req.getPrice() != null ? req.getPrice() : BigDecimal.valueOf(25000));
        property.setDeposit(req.getDeposit() != null ? req.getDeposit() : BigDecimal.ZERO);
        property.setMaintenanceCharges(req.getMaintenanceCharges() != null ? req.getMaintenanceCharges() : BigDecimal.ZERO);
        property.setMaintenanceIncluded(req.isMaintenanceIncluded());
        property.setBhk(req.getBhk());
        property.setBedrooms(req.getBedrooms() != null ? req.getBedrooms() : 0);
        property.setBathrooms(req.getBathrooms() != null ? req.getBathrooms() : 0);
        property.setBalconies(req.getBalconies() != null ? req.getBalconies() : 0);
        property.setBuiltUpArea(req.getBuiltUpArea() != null ? req.getBuiltUpArea() : BigDecimal.valueOf(1000));
        property.setCarpetArea(req.getCarpetArea());
        property.setFurnishing(StringUtils.hasText(req.getFurnishing()) ? req.getFurnishing().trim().toUpperCase() : "UNFURNISHED");
        property.setPreferredTenant(StringUtils.hasText(req.getPreferredTenant()) ? req.getPreferredTenant().trim().toUpperCase() : "ANY");
        property.setFacing(req.getFacing());
        property.setFloorNumber(req.getFloorNumber());
        property.setTotalFloors(req.getTotalFloors());
        property.setAvailableFrom(req.getAvailableFrom() != null ? req.getAvailableFrom() : java.time.LocalDate.now());
        property.setLatitude(lat);
        property.setLongitude(lng);
        property.setAddress(StringUtils.hasText(req.getAddress()) ? req.getAddress().trim() : locality.getName() + ", " + city.getName());
        property.setStatus("ACTIVE");
        property.setVerified(true);
        property.setZeroBrokerage(true);
        return property;
    }

    private void attachSubtypeDetails(Property property, CreatePropertyRequest request) {
        if (request.getPgDetail() != null || "PG".equalsIgnoreCase(property.getAdType()) || "PG".equalsIgnoreCase(property.getPropertyType())) {
            PgDetail pg = new PgDetail();
            if (request.getPgDetail() != null) {
                pg.setGenderAllowed(StringUtils.hasText(request.getPgDetail().getGenderAllowed()) ? request.getPgDetail().getGenderAllowed().toUpperCase() : "CO_LIVING");
                pg.setSharingTypes(StringUtils.hasText(request.getPgDetail().getSharingTypes()) ? request.getPgDetail().getSharingTypes().toUpperCase() : "SINGLE, DOUBLE");
                pg.setFoodIncluded(request.getPgDetail().isFoodIncluded());
                if (request.getPgDetail().getMealsProvided() != null) pg.setMealsProvided(request.getPgDetail().getMealsProvided());
                if (request.getPgDetail().getNoticePeriod() != null) pg.setNoticePeriod(request.getPgDetail().getNoticePeriod());
                if (request.getPgDetail().getDepositMonths() != null) pg.setDepositMonths(request.getPgDetail().getDepositMonths());
                if (request.getPgDetail().getGateClosingTime() != null) pg.setGateClosingTime(request.getPgDetail().getGateClosingTime());
            } else {
                pg.setGenderAllowed("CO_LIVING");
                pg.setSharingTypes("SINGLE, DOUBLE");
                pg.setFoodIncluded(true);
            }
            property.setPgDetail(pg);
        }

        if (request.getCommercialDetail() != null || "COMMERCIAL".equalsIgnoreCase(property.getPropertyType())) {
            CommercialDetail cd = new CommercialDetail();
            if (request.getCommercialDetail() != null) {
                cd.setCommercialType(StringUtils.hasText(request.getCommercialDetail().getCommercialType()) ? request.getCommercialDetail().getCommercialType().toUpperCase() : "OFFICE");
                cd.setPowerLoadKva(request.getCommercialDetail().getPowerLoadKva());
                cd.setCeilingHeightFt(request.getCommercialDetail().getCeilingHeightFt());
                cd.setGoodsLiftAvailable(request.getCommercialDetail().isGoodsLiftAvailable());
                cd.setParkingSlots(request.getCommercialDetail().getParkingSlots() != null ? request.getCommercialDetail().getParkingSlots() : 0);
            } else {
                cd.setCommercialType("OFFICE");
            }
            property.setCommercialDetail(cd);
        }

        if (request.getPlotDetail() != null || "PLOT".equalsIgnoreCase(property.getPropertyType()) || "PLOT".equalsIgnoreCase(property.getAdType())) {
            PlotDetail pd = new PlotDetail();
            if (request.getPlotDetail() != null) {
                pd.setPlotLength(request.getPlotDetail().getPlotLength());
                pd.setPlotBreadth(request.getPlotDetail().getPlotBreadth());
                pd.setBoundaryWall(request.getPlotDetail().isBoundaryWall());
                pd.setCornerPlot(request.getPlotDetail().isCornerPlot());
                pd.setGatedCommunity(request.getPlotDetail().isGatedCommunity());
                pd.setRoadWidthFt(request.getPlotDetail().getRoadWidthFt());
            }
            property.setPlotDetail(pd);
        }
    }

    private void attachAmenities(Property property, List<Integer> amenityIds) {
        if (!CollectionUtils.isEmpty(amenityIds)) {
            List<Amenity> amenities = amenityRepository.findAllById(amenityIds);
            property.setAmenities(new HashSet<>(amenities));
        }
    }

    private void attachImages(Property property, List<String> imageUrls) {
        if (!CollectionUtils.isEmpty(imageUrls)) {
            for (int i = 0; i < imageUrls.size(); i++) {
                String url = imageUrls.get(i);
                PropertyImage img = new PropertyImage();
                img.setImageUrl(url);
                img.setThumbnailUrl(url);
                img.setDisplayOrder(i);
                img.setCover(i == 0);
                property.addImage(img);
            }
        }
    }

    private Sort resolveSort(String sortParam) {
        if (!StringUtils.hasText(sortParam)) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        return switch (sortParam.toLowerCase()) {
            case "price_asc", "price_low_to_high", "low_to_high" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc", "price_high_to_low", "high_to_low" -> Sort.by(Sort.Direction.DESC, "price");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private Optional<UUID> parseUuid(String identifier) {
        try {
            return Optional.of(UUID.fromString(identifier));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    private String generateShortId() {
        for (int attempts = 0; attempts < 10; attempts++) {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(SHORT_ID_ALPHABET.charAt(random.nextInt(SHORT_ID_ALPHABET.length())));
            }
            String candidate = sb.toString();
            if (propertyRepository.findByShortId(candidate).isEmpty()) {
                return candidate;
            }
        }
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private String generateSlug(CreatePropertyRequest req, String localitySlug, String citySlug, String shortId) {
        String bhk = StringUtils.hasText(req.getBhk())
                ? req.getBhk().toLowerCase().replace(" ", "") + "-"
                : "";
        return String.format("%s%s-for-%s-in-%s-%s-id-%s",
                bhk,
                req.getPropertyType().toLowerCase(),
                req.getAdType().toLowerCase(),
                localitySlug,
                citySlug,
                shortId
        ).replaceAll("[^a-z0-9-]", "-").replaceAll("-+", "-");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertySummaryDto> getMyProperties(UUID ownerId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        return propertyRepository.findByOwnerId(ownerId, pageable).map(PropertySummaryDto::fromEntity);
    }

    @Override
    @Transactional
    public PropertyDetailDto updatePropertyStatus(UUID id, UUID requesterId, String status) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        if (property.getOwner() == null || !property.getOwner().getId().equals(requesterId)) {
            throw new ForbiddenException("You do not have permission to modify status for this property");
        }

        property.setStatus(status.toUpperCase().trim());
        Property saved = propertyRepository.save(property);
        log.info("Property {} status updated to {} by user {}", id, property.getStatus(), requesterId);
        return PropertyDetailDto.fromEntity(saved);
    }
}
