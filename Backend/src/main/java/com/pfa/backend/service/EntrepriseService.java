package com.pfa.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pfa.backend.DTO.*;
import com.pfa.backend.entity.*;
import com.pfa.backend.repository.EntrepriseRepository;
import com.pfa.backend.repository.FormeJuridiqueRepository;
import com.pfa.backend.repository.HistoriqueDentrepriseRepository;
import com.pfa.backend.repository.SecteurDactiviteRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EntrepriseService {

    @Autowired
    private EntrepriseRepository entrepriseRepository;
    @Autowired
    private HistoriqueDentrepriseRepository historiqueDentrepriseRepository;
    @Autowired
    private GerantService gerantService;
    @Autowired
    private TelephoneService telephoneService;
    @Autowired
    private  FaxService faxService;
    @Autowired
    private SecteurDactiviteRepository secteurDactiviteRepository;

    @Autowired
    private FormeJuridiqueRepository formeJuridiqueRepository;

    private static final Logger logger = LoggerFactory.getLogger(EntrepriseService.class);
    public List<String> getAllVilles() {
        return entrepriseRepository.findDistinctVille();
    }
    public Entreprise createEntreprise(Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);
    }

    public List<EntrepriseDTO> getAllEntreprises() {
        List<Entreprise> entreprises = entrepriseRepository.findAll();
        return entreprises.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public Optional<EntrepriseDTO> getEntrepriseById(Long id) {
        return entrepriseRepository.findById(id)
                .map(this::convertToDTO);
    }


    private EntrepriseDTO convertToDTO(Entreprise entreprise) {
        EntrepriseDTO dto = new EntrepriseDTO();
        dto.setId(entreprise.getId());
        dto.setDenomination(entreprise.getDenomination());
        dto.setCapitalSocial(entreprise.getCapitalSocial());
        dto.setIce(entreprise.getIce());
        dto.setIdentifiantFiscal(entreprise.getIdentifiantFiscal());
        dto.setNumRegistreCommerce(entreprise.getNumRegistreCommerce());
        dto.setNumPatente(entreprise.getNumPatente());
        dto.setNumAffiliationCnss(entreprise.getNumAffiliationCnss());
        dto.setAdresse(entreprise.getAdresse());
        dto.setVille(entreprise.getVille());
        dto.setMail(entreprise.getMail());
        dto.setSiteWeb(entreprise.getSiteWeb());
        dto.setNombreEmployes(entreprise.getNombreEmployes());
        dto.setLatitude(entreprise.getLatitude());
        dto.setLongitude(entreprise.getLongitude());
        dto.setDateCreation(entreprise.getDateCreation());
        // Conversion du logo BLOB en Base64
        if (entreprise.getLogo() != null) {
            String base64Logo = Base64.getEncoder().encodeToString(entreprise.getLogo());
            dto.setLogo(base64Logo);
        }
        dto.setDateCessationActivite(entreprise.getDateCessationActivite());

        if (entreprise.getSecteurDactivite() != null) {
            SecteurDactiviteDTO secteurDTO = new SecteurDactiviteDTO();
            secteurDTO.setId(entreprise.getSecteurDactivite().getId());
            secteurDTO.setNom(entreprise.getSecteurDactivite().getNom());
            dto.setSecteurDactivite(secteurDTO);
        }

        if (entreprise.getFormeJuridique() != null) {
            FormeJuridiqueDTO formeDTO = new FormeJuridiqueDTO();
            formeDTO.setId(entreprise.getFormeJuridique().getId());
            formeDTO.setNom(entreprise.getFormeJuridique().getNom());
            dto.setFormeJuridique(formeDTO);
        }

        dto.setTelephones(entreprise.getTelephones().stream()
                .map(t -> {
                    TelephoneDTO tDto = new TelephoneDTO();
                    tDto.setId(t.getId());
                    tDto.setNumero(t.getNumero());
                    return tDto;
                })
                .collect(Collectors.toList()));

        dto.setFaxes(entreprise.getFaxes().stream()
                .map(f -> {
                    FaxDTO fDto = new FaxDTO();
                    fDto.setId(f.getId());
                    fDto.setNumero(f.getNumero());
                    return fDto;
                })
                .collect(Collectors.toList()));

        dto.setGerants(entreprise.getGerants().stream()
                .map(g -> {
                    GerantDTO gDto = new GerantDTO();
                    gDto.setId(g.getId());
                    gDto.setNom(g.getNom());
                    gDto.setPrenom(g.getPrenom());
                    return gDto;
                })
                .collect(Collectors.toList()));

        dto.setHistoriqueDentreprise(entreprise.getHistoriqueDentreprise().stream()
                .map(h -> {
                    HistoriqueDentrepriseDTO hDto = new HistoriqueDentrepriseDTO();
                    hDto.setId(h.getId());
                    hDto.setAttributModifie(h.getAttributModifie());
                    hDto.setAncienneValeur(h.getAncienneValeur());
                    hDto.setNouvelleValeur(h.getNouvelleValeur());
                    hDto.setDateModification(h.getDateModification());
                    return hDto;
                })
                .collect(Collectors.toList()));

        return dto;
    }
    @Transactional
    public EntrepriseDTO updateEntreprise(Long id, Map<String, Object> updates, MultipartFile logo) {
        Optional<Entreprise> optionalEntreprise = entrepriseRepository.findById(id);
        if (optionalEntreprise.isEmpty()) {
            throw new EntityNotFoundException("Entreprise introuvable avec l'id " + id);
        }

        Entreprise entreprise = optionalEntreprise.get();
        Entreprise entrepriseOriginale = new Entreprise();
        BeanUtils.copyProperties(entreprise, entrepriseOriginale);

        BeanWrapperImpl beanWrapper = new BeanWrapperImpl(entreprise);
        ObjectMapper objectMapper = new ObjectMapper();

        updates.forEach((key, value) -> {
            if (value != null) {
                try {
                    switch (key) {
                        case "telephones":
                            List<Map<String, Object>> telephoneUpdates = objectMapper.readValue((String) value, List.class);
                            List<Telephone> telephones = telephoneUpdates.stream().map(t -> {
                                Telephone telephone = new Telephone();
                                telephone.setId(Long.valueOf(t.get("id").toString()));
                                telephone.setNumero((String) t.get("numero"));
                                return telephone;
                            }).collect(Collectors.toList());
                            telephoneService.updateTelephonesByEntrepriseId(id, telephones);
                            break;
                        case "faxes":
                            List<Map<String, Object>> faxUpdates = objectMapper.readValue((String) value, List.class);
                            List<Fax> faxes = faxUpdates.stream().map(f -> {
                                Fax fax = new Fax();
                                fax.setId(Long.valueOf(f.get("id").toString()));
                                fax.setNumero((String) f.get("numero"));
                                return fax;
                            }).collect(Collectors.toList());
                            faxService.updateFaxesByEntrepriseId(id, faxes);
                            break;
                        case "gerants":
                            List<Map<String, Object>> gerantUpdates = objectMapper.readValue((String) value, List.class);
                            List<Gerant> gerants = gerantUpdates.stream().map(g -> {
                                Gerant gerant = new Gerant();
                                gerant.setId(Long.valueOf(g.get("id").toString()));
                                gerant.setNom((String) g.get("nom"));
                                gerant.setPrenom((String) g.get("prenom"));
                                return gerant;
                            }).collect(Collectors.toList());
                            gerantService.updateGerantsByEntrepriseId(id, gerants);
                            break;

                        case "formeJuridique":
                            if (value != null && !value.toString().isEmpty()) {
                                Long formeId = Long.valueOf(value.toString());
                                FormeJuridique forme = formeJuridiqueRepository.findById(formeId)
                                        .orElseThrow(() -> new EntityNotFoundException("Forme juridique introuvable avec l'id " + formeId));
                                entreprise.setFormeJuridique(forme);
                            }
                            break;
                        case "secteurDactivite":
                            if (value != null && !value.toString().isEmpty()) {
                                Long secteurId = Long.valueOf(value.toString());
                                SecteurDactivite secteur = secteurDactiviteRepository.findById(secteurId)
                                        .orElseThrow(() -> new EntityNotFoundException("Secteur d'activité introuvable avec l'id " + secteurId));
                                entreprise.setSecteurDactivite(secteur);
                            }
                            break;
                        case "dateCreation":
                            String dateStr = (String) value;
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                            Date dateCreation = sdf.parse(dateStr);
                            entreprise.setDateCreation(dateCreation);
                            break;
                        case "dateCessationActivite":
                            String dateCessationStr = (String) value;
                            SimpleDateFormat sdfCessation = new SimpleDateFormat("yyyy-MM-dd");
                            Date dateCessation = sdfCessation.parse(dateCessationStr);
                            entreprise.setDateCessationActivite(dateCessation);
                            break;
                        
                        default:
                            beanWrapper.setPropertyValue(key, value);
                            break;
                    }

                } catch (Exception e) {
                    throw new RuntimeException("Erreur lors de la mise à jour des champs: " + key, e);
                }
            }
        });

        if (logo != null) {
            try {
                entreprise.setLogo(logo.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de la lecture du fichier logo", e);
            }
        }

        Entreprise entrepriseMiseAJour = entrepriseRepository.save(entreprise);
        saveHistoryChanges(entrepriseOriginale, entrepriseMiseAJour);

        return convertToDTO(entrepriseMiseAJour);
    }

    private void saveHistoryChanges(Entreprise originalEntreprise, Entreprise updatedEntreprise) {
        BeanWrapper originalWrapper = new BeanWrapperImpl(originalEntreprise);
        BeanWrapper updatedWrapper = new BeanWrapperImpl(updatedEntreprise);

        for (Field field : Entreprise.class.getDeclaredFields()) {
            field.setAccessible(true);  // Ensure we can access private fields
            Object originalValue = originalWrapper.getPropertyValue(field.getName());
            Object updatedValue = updatedWrapper.getPropertyValue(field.getName());

            boolean valuesDiffer = (originalValue != null && !originalValue.equals(updatedValue)) ||
                    (originalValue == null && updatedValue != null);

            if (valuesDiffer) {
                String originalStringValue = originalValue != null ? originalValue.toString() : null;
                String updatedStringValue = updatedValue != null ? updatedValue.toString() : null;

                boolean alreadyExists = historiqueDentrepriseRepository.existsByEntrepriseAndAttributModifieAndAncienneValeurAndNouvelleValeur(
                        updatedEntreprise, field.getName(), originalStringValue, updatedStringValue);

                if (!alreadyExists) {
                    HistoriqueDentreprise historique = new HistoriqueDentreprise();
                    historique.setEntreprise(updatedEntreprise);
                    historique.setAttributModifie(field.getName());
                    historique.setAncienneValeur(originalStringValue);
                    historique.setNouvelleValeur(updatedStringValue);
                    historique.setDateModification(new Date());
                    historiqueDentrepriseRepository.save(historique);
                }
            }
        }
    }





    public void deleteEntreprise(Long id) {
        entrepriseRepository.deleteById(id);
    }
    // Méthode de filtrage des entreprises
    public List<EntrepriseDTO> filterEntreprises(String ville, String denomination, String secteurNom, String formeJuridiqueNom) {
        List<Entreprise> entreprises = entrepriseRepository.filterEntreprises(ville, denomination, secteurNom, formeJuridiqueNom);
        return entreprises.stream().map(this::convertToDTO).collect(Collectors.toList());
    }


    public void deleteField(Long id, String fieldName) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entreprise non trouvée avec l'id " + id));

        switch (fieldName) {
            case "denomination":
                entreprise.setDenomination(null);
                break;
            case "capitalSocial":
                entreprise.setCapitalSocial(null);
                break;
            case "ice":
                entreprise.setIce(null);
                break;
            case "identifiantFiscal":
                entreprise.setIdentifiantFiscal(null);
                break;
            case "numRegistreCommerce":
                entreprise.setNumRegistreCommerce(null);
                break;
            case "numPatente":
                entreprise.setNumPatente(null);
                break;
            case "numAffiliationCnss":
                entreprise.setNumAffiliationCnss(null);
                break;
            case "adresse":
                entreprise.setAdresse(null);
                break;
            case "ville":
                entreprise.setVille(null);
                break;
            case "mail":
                entreprise.setMail(null);
                break;
            case "siteWeb":
                entreprise.setSiteWeb(null);
                break;
            case "nombreEmployes":
                entreprise.setNombreEmployes(null);
                break;
            case "latitude":
                entreprise.setLatitude(null);
                break;
            case "longitude":
                entreprise.setLongitude(null);
                break;
            case "dateCreation":
                entreprise.setDateCreation(null);
                break;
            case "dateCessationActivite":
                entreprise.setDateCessationActivite(null);
                break;
            case "telephones":
                entreprise.setTelephones(null);
                break;
            case "faxes":
                entreprise.setFaxes(null);
                break;
            case "gerants":
                entreprise.setGerants(null);
                break;
            case "secteurDactivite":
                entreprise.setSecteurDactivite(null);
                break;
            case "formeJuridique":
                entreprise.setFormeJuridique(null);
                break;

            case "logo":
                entreprise.setLogo(null);
                break;
            default:
                throw new IllegalArgumentException("Champ non reconnu: " + fieldName);
        }

        entrepriseRepository.save(entreprise);
    }
}