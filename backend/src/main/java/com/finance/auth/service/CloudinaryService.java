package com.finance.auth.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.finance.auth.entity.User;
import com.finance.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

	  private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
	    private final Cloudinary cloudinary;
	    private final UserRepository userRepository;

	    public CloudinaryService(Cloudinary cloudinary, UserRepository userRepository) {
	        this.cloudinary = cloudinary;           // <- inject từ bean
	        this.userRepository = userRepository;
	        log.info("✅ CloudinaryService initialized with account: {}", cloudinary.config.cloudName);
	    }


    @SuppressWarnings("unchecked")
    public String uploadAvatar(MultipartFile file, Authentication authentication) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("❌ File upload cannot be null or empty");
        }

        // 🔐 Lấy user từ authentication
        String email = authentication.getName();
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        try {
            // 🧩 Nếu user đã có avatar cũ → xóa trước
            if (user.getAvatarUrl() != null && !user.getAvatarUrl().isBlank()) {
                String oldUrl = user.getAvatarUrl();
                String oldPublicId = extractPublicIdFromUrl(oldUrl);
                if (oldPublicId != null) {
                    Map result = cloudinary.uploader().destroy(oldPublicId, ObjectUtils.emptyMap());
                    log.info("🗑️ Deleted old avatar: {} → {}", oldPublicId, result.get("result"));
                }
            }

            // 🚀 Upload ảnh mới
            Map<String, Object> params = ObjectUtils.asMap(
                "folder", "avatars/",
                "use_filename", true,
                "unique_filename", false,
                "overwrite", true,
                "transformation", new Transformation()
                        .width(400)
                        .height(400)
                        .crop("fill")
                        .gravity("face"),
                "public_id", "user_" + user.getId() + "_" + System.currentTimeMillis()
            );

            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            log.info("✅ Uploaded new avatar: {} (publicId={})", url, publicId);

            // 🧾 Cập nhật user
            user.setAvatarUrl(url);
            userRepository.save(user);

            return url;

        } catch (IOException e) {
            log.error("❌ Failed to upload avatar for {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }

    /**
     * 🧠 Helper — lấy public_id từ URL Cloudinary
     * Ex: https://res.cloudinary.com/dhonyczq6/image/upload/v1234567/avatars/user_1_1739999999.png
     * → avatars/user_1_1739999999
     */
    private String extractPublicIdFromUrl(String url) {
        try {
            int start = url.indexOf("/upload/") + "/upload/".length();
            String afterUpload = url.substring(start);
            // Bỏ phần version (v12345/)
            if (afterUpload.startsWith("v")) {
                afterUpload = afterUpload.substring(afterUpload.indexOf('/') + 1);
            }
            // Bỏ phần extension (.jpg, .png)
            return afterUpload.substring(0, afterUpload.lastIndexOf('.'));
        } catch (Exception e) {
            log.warn("⚠️ Could not extract public_id from URL: {}", url);
            return null;
        }
    }
}
