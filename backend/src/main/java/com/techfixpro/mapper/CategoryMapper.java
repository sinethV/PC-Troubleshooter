package com.techfixpro.mapper;

import com.techfixpro.dto.category.CategoryRequest;
import com.techfixpro.dto.category.CategoryResponse;
import com.techfixpro.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        if (category == null) return null;
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setSlug(category.getSlug());
        response.setIconName(category.getIconName());
        response.setDescription(category.getDescription());
        response.setSortOrder(category.getSortOrder());
        response.setCommandCount(category.getCommands() != null ? category.getCommands().size() : 0);
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());
        return response;
    }

    public Category toEntity(CategoryRequest request) {
        if (request == null) return null;
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug().toLowerCase().trim().replaceAll("\\s+", "-"));
        category.setIconName(request.getIconName() != null ? request.getIconName() : "Wrench");
        category.setDescription(request.getDescription());
        category.setSortOrder(request.getSortOrder());
        return category;
    }

    public void updateEntity(Category category, CategoryRequest request) {
        if (category == null || request == null) return;
        category.setName(request.getName());
        category.setSlug(request.getSlug().toLowerCase().trim().replaceAll("\\s+", "-"));
        if (request.getIconName() != null) {
            category.setIconName(request.getIconName());
        }
        category.setDescription(request.getDescription());
        category.setSortOrder(request.getSortOrder());
    }
}
