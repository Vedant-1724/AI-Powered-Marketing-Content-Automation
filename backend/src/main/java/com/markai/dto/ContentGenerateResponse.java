package com.markai.dto;

import lombok.Data;
import java.util.List;

@Data
public class ContentGenerateResponse {
    private String content;
    private String contentType;
    private String tone;
    private Integer wordCount;
    private Double seoScore;
    private List<String> keywordsUsed;
    private List<String> suggestions;
}
