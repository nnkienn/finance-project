package com.finance.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
	 @Email @NotBlank
	    private String email;
	    @NotBlank @Size(min = 6)
	    private String password;
	    private String fullName;
	    private String avatarUrl;
	    private String facebookId;
	    private String googleId;

}
