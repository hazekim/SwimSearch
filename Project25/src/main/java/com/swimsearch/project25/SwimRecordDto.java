package com.swimsearch.project25;

import lombok.Data;

@Data
public class SwimRecordDto {
    private Long userId;
    private Long poolId;
    private float distance;
    private int timeInSeconds;
    private Long timeInMillis;
}
