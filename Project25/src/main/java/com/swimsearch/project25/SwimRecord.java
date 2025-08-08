package com.swimsearch.project25.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
public class SwimRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long poolId;

    private float distance;
    private int timeInSeconds;
    private Long timeInMillis;

    private LocalDateTime createdAt = LocalDateTime.now();
}