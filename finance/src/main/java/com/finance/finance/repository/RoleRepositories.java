package com.finance.finance.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.finance.entity.Role;

public interface RoleRepositories extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);

}
