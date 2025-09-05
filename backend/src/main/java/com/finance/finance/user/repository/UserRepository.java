package com.finance.finance.user.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.finance.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long>  {
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);

}
