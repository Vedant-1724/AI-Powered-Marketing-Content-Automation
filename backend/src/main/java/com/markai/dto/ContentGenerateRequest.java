package com.markai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class ContentGenerateRequest {
    @NotBlank(message = "Content type is required")
    private String contentType;

    @NotBlank(message = "Topic is required")
    private String topic;

    private String tone = "professional";
    private List<String> keywords;
    private String targetAudience;
    private String brandId;
    private Integer maxLength;
    private String additionalInstructions;
    private String platform;
}
