package com.pfa.backend.service;

import com.pfa.backend.entity.Entreprise;
import com.pfa.backend.entity.Gerant;
import com.pfa.backend.repository.EntrepriseRepository;
import com.pfa.backend.repository.GerantRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GerantService {

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private GerantRepository gerantRepository;

    @Autowired
    private HistoriqueDentrepriseService historiqueDentrepriseService;

    public List<Gerant> getGerantsByEntrepriseId(Long entrepriseId) {
        return gerantRepository.findByEntrepriseId(entrepriseId);
    }

    public Optional<Gerant> findById(Long id) {
        return gerantRepository.findById(id);
    }

    public Gerant save(Gerant gerant) {
        return gerantRepository.save(gerant);
    }

    public void deleteById(Long id) {
        gerantRepository.deleteById(id);
    }

    @Transactional
    public List<Gerant> updateGerantsByEntrepriseId(Long entrepriseId, List<Gerant> updatedGerants) {
        Optional<Entreprise> optionalEntreprise = entrepriseRepository.findById(entrepriseId);
        if (optionalEntreprise.isEmpty()) {
            throw new EntityNotFoundException("Entreprise introuvable avec l'id " + entrepriseId);
        }

        Entreprise entreprise = optionalEntreprise.get();
        List<Gerant> existingGerants = gerantRepository.findByEntrepriseId(entrepriseId);

        for (Gerant existingGerant : existingGerants) {
            if (updatedGerants.stream().noneMatch(g -> g.getId().equals(existingGerant.getId()))) {
                historiqueDentrepriseService.logChange(entreprise, "gerant", existingGerant.getNom() + " " + existingGerant.getPrenom(), null);
                gerantRepository.delete(existingGerant);
            }
        }

        for (Gerant updatedGerant : updatedGerants) {
            Optional<Gerant> optionalExistingGerant = existingGerants.stream()
                    .filter(g -> g.getId().equals(updatedGerant.getId()))
                    .findFirst();

            if (optionalExistingGerant.isPresent()) {
                Gerant existingGerant = optionalExistingGerant.get();
                String oldValue = existingGerant.getNom() + " " + existingGerant.getPrenom();
                String newValue = updatedGerant.getNom() + " " + updatedGerant.getPrenom();
                historiqueDentrepriseService.logChange(entreprise, "gerant", oldValue, newValue);
                existingGerant.setNom(updatedGerant.getNom());
                existingGerant.setPrenom(updatedGerant.getPrenom());
                gerantRepository.save(existingGerant);
            } else {
                updatedGerant.setEntreprise(entreprise);
                gerantRepository.save(updatedGerant);
                historiqueDentrepriseService.logChange(entreprise, "gerant", null, updatedGerant.getNom() + " " + updatedGerant.getPrenom());
            }
        }

        return gerantRepository.findByEntrepriseId(entrepriseId);
    }


}