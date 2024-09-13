package com.pfa.backend.service;

import com.pfa.backend.entity.Entreprise;
import com.pfa.backend.entity.Fax;
import com.pfa.backend.repository.EntrepriseRepository;
import com.pfa.backend.repository.FaxRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FaxService {

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private FaxRepository faxRepository;

    @Autowired
    private HistoriqueDentrepriseService historiqueDentrepriseService;

    public List<Fax> getFaxesByEntrepriseId(Long entrepriseId) {
        return faxRepository.findByEntrepriseId(entrepriseId);
    }

    public Optional<Fax> findById(Long id) {
        return faxRepository.findById(id);
    }

    public Fax save(Fax fax) {
        return faxRepository.save(fax);
    }

    public void deleteById(Long id) {
        faxRepository.deleteById(id);
    }

    @Transactional
    public List<Fax> updateFaxesByEntrepriseId(Long entrepriseId, List<Fax> updatedFaxes) {
        Optional<Entreprise> optionalEntreprise = entrepriseRepository.findById(entrepriseId);
        if (optionalEntreprise.isEmpty()) {
            throw new EntityNotFoundException("Entreprise introuvable avec l'id " + entrepriseId);
        }

        Entreprise entreprise = optionalEntreprise.get();
        List<Fax> existingFaxes = faxRepository.findByEntrepriseId(entrepriseId);

        for (Fax existingFax : existingFaxes) {
            if (updatedFaxes.stream().noneMatch(f -> f.getId().equals(existingFax.getId()))) {
                historiqueDentrepriseService.logChange(entreprise, "fax", existingFax.getNumero(), null);
                faxRepository.delete(existingFax);
            }
        }

        for (Fax updatedFax : updatedFaxes) {
            Optional<Fax> optionalExistingFax = existingFaxes.stream()
                    .filter(f -> f.getId().equals(updatedFax.getId()))
                    .findFirst();

            if (optionalExistingFax.isPresent()) {
                Fax existingFax = optionalExistingFax.get();
                historiqueDentrepriseService.logChange(entreprise, "fax", existingFax.getNumero(), updatedFax.getNumero());
                existingFax.setNumero(updatedFax.getNumero());
                faxRepository.save(existingFax);
            } else {
                updatedFax.setEntreprise(entreprise);
                faxRepository.save(updatedFax);
                historiqueDentrepriseService.logChange(entreprise, "fax", null, updatedFax.getNumero());
            }
        }

        return faxRepository.findByEntrepriseId(entrepriseId);
    }

}