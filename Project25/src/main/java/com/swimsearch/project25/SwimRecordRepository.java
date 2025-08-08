package com.swimsearch.project25.repository;

import com.swimsearch.project25.entity.SwimRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SwimRecordRepository extends JpaRepository<SwimRecord, Long> {
    List<SwimRecord> findTop10ByPoolIdOrderByTimeInSecondsAsc(Long poolId);
}
