package es.uam.tfm.resources.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.uam.tfm.resources.api.dto.ResourceRQ;
import es.uam.tfm.resources.exception.DocumentNotFoundException;
import es.uam.tfm.resources.exception.InsertException;
import es.uam.tfm.resources.model.*;
import es.uam.tfm.resources.service.ResourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.SplittableRandom;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/activitea/resource")
@Slf4j
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createResource(@RequestParam("jsonData") String jsonData,
                                                 @RequestParam("photo") MultipartFile photo,
                                                 @RequestParam("sound") MultipartFile sound,
                                                 @RequestParam("typeActivity") String typeActivity,
                                                 @RequestParam("activityData") String activityData,
                                                 @RequestParam(value = "activityFiles", required = false) List<MultipartFile> activityFiles) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Resource resource = objectMapper.readValue(jsonData, Resource.class);
            Activity activity = new Activity() {
            };
            switch (typeActivity) {
                case "unirC":
                    activity = objectMapper.readValue(activityData, UnirCActivity.class);
                    break;
                case "url":
                    activity = objectMapper.readValue(activityData, UrlActivity.class);
                    break;
                case "cat":
                    activity = objectMapper.readValue(activityData, CatActivity.class);
                    break;
            }
            this.service.createResource(resource, photo, sound, activity, activityFiles);
            return ResponseEntity.ok().build();
        } catch (InsertException ex) {
            log.error("Error:" + ex);
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/duplicate")
    public ResponseEntity<String> duplicatePublicResource(@RequestParam("identification") String identification,
                                                          @RequestParam("email") String email) {
        try {
            this.service.duplicateResource(identification, email);
            return ResponseEntity.ok().build();
        } catch (InsertException ex) {
            log.error("Error:" + ex);
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/doOCR")
    public ResponseEntity<List<String>> doOCR(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(this.service.getDataOfFileActivity(file));
        } catch (Exception ex) {
            log.error("Error: " + ex);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getCategories")
    public ResponseEntity<List<String>> getCategories() {
        try {
            return ResponseEntity.ok(this.service.getAllCategories());
        } catch (DocumentNotFoundException ex) {
            log.error("Error: " + ex);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/puResources")
    public ResponseEntity<List<Resource>> getPublicResources() {
        try {
            return ResponseEntity.ok(this.service.getAllPublicResources());
        } catch (DocumentNotFoundException ex) {
            log.error("Error: " + ex);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getResources")
    public ResponseEntity<List<Resource>> getResources(@RequestParam("email") String email,
                                                       @RequestParam("type") String type) {
        try {
            return ResponseEntity.ok(this.service.getResourcesByOwnerAndType(email, type));
        } catch (DocumentNotFoundException ex) {
            log.error("Error: " + ex);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getPublicResourcesByNameLike")
    public ResponseEntity<List<Resource>> getPublicResourcesByNameLike(@RequestParam("name") String name) {
        try {
            return ResponseEntity.ok(this.service.getPublicResourcesByNameLike(name));
        } catch (DocumentNotFoundException ex) {
            log.error("Error: " + ex);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getPrivateResourcesByNameLike")
    public ResponseEntity<List<Resource>> getPrivateResourcesByNameLike(@RequestParam("name") String name,
                                                                        @RequestParam("email") String email) {
        try {
            return ResponseEntity.ok(this.service.getPrivateResourcesByNameLike(name, email));
        } catch (DocumentNotFoundException ex) {
            log.error("Error: " + ex);
            return ResponseEntity.notFound().build();
        }
    }
}
