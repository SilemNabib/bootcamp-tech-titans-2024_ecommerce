package com.sunflowers.ecommerce.product.repository;

import com.sunflowers.ecommerce.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for performing CRUD operations on Product entities.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findDistinctByCategoriesNameInAndCategoriesNameIsNotNull(List<String> categoryNames, Pageable pageable);
}
