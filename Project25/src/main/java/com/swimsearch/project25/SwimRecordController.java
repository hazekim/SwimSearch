package com.swimsearch.project25;

import com.swimsearch.project25.SwimRecordDto;
import com.swimsearch.project25.entity.SwimRecord;
import com.swimsearch.project25.repository.SwimRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class SwimRecordController {

    private final SwimRecordRepository swimRecordRepository;

    @Autowired
    private SwimRecordRepository recordRepository;

    // 기록 저장
    @PostMapping
    public String saveRecord(@RequestBody SwimRecordDto dto) {
        SwimRecord record = new SwimRecord();
        record.setUserId(dto.getUserId());
        record.setPoolId(dto.getPoolId());
        record.setDistance(dto.getDistance());
        record.setTimeInMillis(dto.getTimeInMillis());  // 변수 명칭 통일
        recordRepository.save(record);
        return "Record saved successfully";
    }
    //전체 기록 조회
    @GetMapping
    public List<SwimRecord> getRecords() {
        return recordRepository.findAll();
    }


    // 특정 수영장의 TOP10 기록 불러오기
    @GetMapping("/leaderboard/{poolId}")
    public List<SwimRecord> getTopRecords(@PathVariable Long poolId) {
        return recordRepository.findTop10ByPoolIdOrderByTimeInSecondsAsc(poolId);
    }
}
