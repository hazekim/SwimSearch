package com.swimsearch.project25;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "poolinfo")

public class PoolInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int id;
    private String name;
    private String contact;
    private String email;
    private String address;
    private String length;
    private String depth;
    private int lane;
}


