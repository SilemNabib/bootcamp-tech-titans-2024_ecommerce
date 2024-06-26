package com.sunflowers.ecommerce.product.service;

import com.sunflowers.ecommerce.product.entity.Banner;
import com.sunflowers.ecommerce.product.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class BannerImageService {

    @Autowired
    private BannerRepository bannerImageRepository;

    @Autowired
    private ImageService imageService;

    /**
     * Uploads a banner image.
     *
     * @param file the image file to upload
     * @return the saved Banner entity
     * @throws IOException if an error occurs during file upload
     */
    @Transactional
    public Banner uploadImage(MultipartFile file) throws IOException {
        Banner image = bannerImageRepository.save(Banner.builder()
                .build());

        String fileName = image.getId() + "-" + file.getOriginalFilename();
        image.setImageUrl(imageService.uploadImage(file, ImageService.ImageType.BANNER, fileName));

        return bannerImageRepository.save(image);
    }

    /**
     * Retrieves active banners.
     *
     * @return an Iterable of active Banner entities
     */
    public Iterable<Banner> getActive() {
        Specification<Banner> spec = (root, query, cb) -> cb.equal(root.get("deleted"), null);
        return bannerImageRepository.findAll();
    }
}
