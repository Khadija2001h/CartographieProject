package com.pfa.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class SecteurDactivite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @OneToMany(mappedBy = "secteurDactivite")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Entreprise> entreprises = new ArrayList<>();
}
