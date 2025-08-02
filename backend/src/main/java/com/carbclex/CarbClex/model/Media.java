package com.carbclex.CarbClex.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "media")
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    @ElementCollection
    @CollectionTable(name = "media_documents", joinColumns = @JoinColumn(name = "media_id"))
    @Column(name = "document_url")
    // private List<String> documentUrls;
    private List<Documents> documents;

    @ElementCollection
    @CollectionTable(name = "media_images", joinColumns = @JoinColumn(name = "media_id"))
    @Column(name = "image_url")
    // private List<String> imageUrls;
    private List<Image> images;


    private Integer projectId;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    // public List<String> getDocumentUrls() {
    //     return documentUrls;
    // }

    // public void setDocumentUrls(List<String> documentUrls) {
    //     this.documentUrls = documentUrls;
    // }

    // public List<String> getImageUrls() {
    //     return imageUrls;
    // }

    // public void setImageUrls(List<String> imageUrls) {
    //     this.imageUrls = imageUrls;
    // }

     public List<Documents> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Documents> documents) {
        this.documents = documents;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }
}
