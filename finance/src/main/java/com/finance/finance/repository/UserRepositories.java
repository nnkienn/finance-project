package com.finance.finance.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.finance.entity.User;

public interface UserRepositories extends JpaRepository<User, Long>  {
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);

}
