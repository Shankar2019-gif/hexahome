package com.hexahome.application.service;

import com.hexahome.application.dto.admin.user.*;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.persistence.entity.Role;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.LeadRepository;
import com.hexahome.persistence.repository.PropertyRepository;
import com.hexahome.persistence.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminUserManagementServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private LeadRepository leadRepository;

    @Mock
    private AuditLogPort auditLogPort;

    private AdminUserManagementService userService;

    private User testUser;
    private UUID userId;
    private UUID adminId;

    @BeforeEach
    void setUp() {
        userService = new AdminUserManagementService(
                userRepository,
                propertyRepository,
                leadRepository,
                auditLogPort
        );

        userId = UUID.randomUUID();
        adminId = UUID.randomUUID();

        testUser = new User();
        testUser.setId(userId);
        testUser.setName("John Doe");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setPhone("9876543210");
        testUser.setEmail("john.doe@example.com");
        testUser.setActive(true);
        testUser.setVerified(true);
        testUser.setRoles(Set.of(new Role(1, "ROLE_CUSTOMER", "Regular Customer")));
        testUser.setCreatedAt(Instant.now());
        testUser.setUpdatedAt(Instant.now());
    }

    @Test
    void searchUsers_Success() {
        AdminUserFilterRequest request = new AdminUserFilterRequest();
        request.setPage(0);
        request.setSize(10);

        Page<User> userPage = new PageImpl<>(List.of(testUser));
        when(userRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(userPage);
        when(propertyRepository.countByOwnerId(userId)).thenReturn(3L);

        Page<AdminUserProfileSummaryDto> result = userService.searchUsers(request);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        AdminUserProfileSummaryDto dto = result.getContent().get(0);
        assertEquals(userId, dto.getId());
        assertEquals("John Doe", dto.getName());
        assertTrue(dto.getMaskedPhone().endsWith("3210"));
        assertTrue(dto.getMaskedPhone().startsWith("******"));
        assertTrue(dto.getMaskedEmail().startsWith("j"));
        assertTrue(dto.getMaskedEmail().contains("@example.com"));
        assertEquals(3L, dto.getPropertyCount());
        assertTrue(dto.isActive());
        assertTrue(dto.isVerified());
    }

    @Test
    void getUserDetail_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(propertyRepository.countByOwnerId(userId)).thenReturn(4L);
        when(leadRepository.countBySeekerId(userId)).thenReturn(2L);

        AdminUserProfileDetailDto detail = userService.getUserDetail(userId);

        assertNotNull(detail);
        assertEquals(userId, detail.getId());
        assertEquals("John Doe", detail.getName());
        assertEquals("John", detail.getFirstName());
        assertEquals("Doe", detail.getLastName());
        assertEquals(4L, detail.getTotalPropertiesListed());
        assertEquals(2L, detail.getTotalLeadsSubmitted());
        assertTrue(detail.getMaskedPhone().endsWith("3210"));
        assertTrue(detail.getMaskedEmail().contains("@example.com"));
    }

    @Test
    void getUserDetail_NotFound_ThrowsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserDetail(userId));
    }

    @Test
    void blockUser_Success() {
        UserBlockActionRequest req = new UserBlockActionRequest("Violated platform terms");
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        userService.blockUser(userId, req, adminId, "127.0.0.1");

        assertFalse(testUser.isActive());
        verify(userRepository).save(testUser);
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("BLOCK_USER"),
                eq("USER"),
                eq(userId.toString()),
                eq("ACTIVE"),
                eq("BLOCKED"),
                eq("Violated platform terms"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void blockUser_AlreadyInactive_ThrowsBadRequestException() {
        testUser.setActive(false);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        UserBlockActionRequest req = new UserBlockActionRequest("Spam");

        assertThrows(BadRequestException.class, () -> userService.blockUser(userId, req, adminId, "127.0.0.1"));
        verify(userRepository, never()).save(any());
        verify(auditLogPort, never()).recordAction(any(), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void unblockUser_Success() {
        testUser.setActive(false);
        UserBlockActionRequest req = new UserBlockActionRequest("Resolved verification issue");
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        userService.unblockUser(userId, req, adminId, "127.0.0.1");

        assertTrue(testUser.isActive());
        verify(userRepository).save(testUser);
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("UNBLOCK_USER"),
                eq("USER"),
                eq(userId.toString()),
                eq("BLOCKED"),
                eq("ACTIVE"),
                eq("Resolved verification issue"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void unblockUser_AlreadyActive_ThrowsBadRequestException() {
        testUser.setActive(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        UserBlockActionRequest req = new UserBlockActionRequest("Unblock");

        assertThrows(BadRequestException.class, () -> userService.unblockUser(userId, req, adminId, "127.0.0.1"));
        verify(userRepository, never()).save(any());
    }

    @Test
    void revealUserPii_Success() {
        RevealPiiRequest req = new RevealPiiRequest("Legal subpoena compliance");
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        RevealPiiResponse resp = userService.revealUserPii(userId, req, adminId, "10.0.0.1");

        assertNotNull(resp);
        assertEquals(userId, resp.getUserId());
        assertEquals("9876543210", resp.getPhone());
        assertEquals("john.doe@example.com", resp.getEmail());

        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("REVEAL_USER_PII"),
                eq("USER"),
                eq(userId.toString()),
                isNull(),
                eq("PII_REVEALED"),
                eq("Legal subpoena compliance"),
                eq("10.0.0.1"),
                eq("SUCCESS")
        );
    }
}
