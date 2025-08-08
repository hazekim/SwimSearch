package com.swimsearch.project25;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pools")

public class PoolInfoController {
    @Autowired
    private PoolInfoRepository repository;

    @GetMapping
    public List<PoolInfo> getAllPools() {
        return repository.findAll();
    }
}

