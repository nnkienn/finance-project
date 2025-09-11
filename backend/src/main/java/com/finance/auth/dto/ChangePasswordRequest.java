package com.finance.auth.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ChangePasswordRequest {
	    @NotBlank
	    private String currentPassword;

	    @NotBlank @Size(min = 6, message = "New password must be at least 6 characters")
	    private String newPassword;

	    public String getCurrentPassword() { return currentPassword; }
	    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
	    public String getNewPassword() { return newPassword; }
	    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
