package es.uam.tfm.resources.service;

import es.uam.tfm.resources.exception.DocumentNotFoundException;
import es.uam.tfm.resources.exception.InsertException;
import es.uam.tfm.resources.model.Activity;
import es.uam.tfm.resources.model.CatActivity;
import es.uam.tfm.resources.model.Resource;
import es.uam.tfm.resources.model.UnirCActivity;
import es.uam.tfm.resources.repository.ResourceRepository;
import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Slf4j
@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    private String errorMsg;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public void createResource(Resource resource, MultipartFile photo, MultipartFile sound, Activity activity, List<MultipartFile> activityFiles) throws InsertException {
        try {
            log.info("Creating resource");
            String directory = "/PERSONAL/UAM/TFM/ServidorArchivos/";
            String path = resource.getEmailOwner() + "/" + resource.getType() + "/" + resource.getName();
            String fileDefaultPath = path + "/config/defaultConfig";
            String filesPath = directory + fileDefaultPath;
            resource.setIdentification(resource.getEmailOwner() + "/" + resource.getType() + "/" + resource.getName().replaceAll(" ", ""));
            resource.setImgLocation(path + "/" + photo.getOriginalFilename());
            resource.setAudioLocation(path + "/" + sound.getOriginalFilename());
            if (resource.getType().equals("PUBLIC")) {
                List<Resource> pubResourceExist = this.resourceRepository.findByNameAndType(resource.getName(), resource.getType());
                if (!pubResourceExist.isEmpty()) {
                    log.error("Public resource with name: " + resource.getName() + " already exist !");
                    this.errorMsg = "Error al crear recurso, recurso publico con nombre: " + resource.getName() + " ya existe!";
                    throw new InsertException(Resource.class.getSimpleName(), this.errorMsg);
                }
            }
            if (activity instanceof CatActivity) {
                log.info("Recurso con actividad de tipo: Categorizar");
                CatActivity catActivity = (CatActivity) activity;
                catActivity.getRecords().forEach(record -> {
                    if (record.getCategoryImg() != null && !record.getCategoryImg().equals("")) {
                        String fakePath = record.getCategoryImg();
                        record.setCategoryImg(fileDefaultPath + "/" + fakePath.split("\\\\")[2]);
                    }
                    if (record.getCategoryAudio() != null && !record.getCategoryAudio().equals("")) {
                        String fakePath = record.getCategoryAudio();
                        record.setCategoryAudio(fileDefaultPath + "/" + fakePath.split("\\\\")[2]);
                    }
                    record.getElements().forEach(element -> {
                        if (element.getElementImg() != null && !element.getElementImg().equals("")) {
                            String fakePath = element.getElementImg();
                            element.setElementImg(fileDefaultPath + "/" + fakePath.split("\\\\")[2]);
                        }
                        if (element.getElementAudio() != null && !element.getElementAudio().equals("")) {
                            String fakePath = element.getElementAudio();
                            element.setElementAudio(fileDefaultPath + "/" + fakePath.split("\\\\")[2]);
                        }
                    });
                });
                activity = catActivity;
            }
            if (activity instanceof UnirCActivity) {
                log.info("Recurso con actividad de tipo: Unir Correspondencia");
                UnirCActivity unirCActivity = (UnirCActivity) activity;
                unirCActivity.getRecords().forEach(record -> {
                    if (record.getKeyImg() != null && !record.getKeyImg().equals("")) {
                        String fakePath = record.getKeyImg();
                        record.setKeyImg(fileDefaultPath + "/" + fakePath.split("\\\\")[2]);
                    }
                    if (record.getKeyAudio() != null && !record.getKeyAudio().equals("")) {
                        String fakePath = record.getKeyAudio();
                        record.setKeyAudio(fileDefaultPath + "/" + fakePath.split("\\\\")[2]);
                    }
                    if (record.getDefinitionImg() != null && !record.getDefinitionImg().equals("")) {
                        String fakePath = record.getDefinitionImg();
                        record.setDefinitionImg(fileDefaultPath + "/" + fakePath.split("\\\\")[2]);
                    }
                    if (record.getDefinitionAudio() != null && !record.getDefinitionAudio().equals("")) {
                        String fakePath = record.getDefinitionAudio();
                        record.setDefinitionAudio(fileDefaultPath + "/" + fakePath.split("\\\\")[2]);
                    }
                });
                activity = unirCActivity;
            }
            if (activity instanceof UnirCActivity) {
                log.info("Recurso con actividad de tipo: Url");
            }
            resource.setActivity(activity);
            this.resourceRepository.insert(resource);
            this.checkDirectory(directory + path);
            this.saveFile(photo, directory + resource.getImgLocation());
            this.saveFile(sound, directory + resource.getAudioLocation());
            if (activityFiles != null && !activityFiles.isEmpty()) {
                this.checkDirectory(filesPath);
                activityFiles.forEach(file -> {
                    try {
                        this.saveFile(file, filesPath + "/" + file.getOriginalFilename());
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
            }
        } catch (Exception ex) {
            log.error("Error creating resource: " + ex);
            if (this.errorMsg != null) {
                throw new InsertException(Resource.class.getSimpleName(), this.errorMsg);
            } else {
                throw new InsertException(Resource.class.getSimpleName(), "Error al crear recurso");
            }
        }
    }

    public void duplicateResource(String identification, String email) throws InsertException {
        try {
            log.info("Duplicating resource:" + identification);
            String directory = "/PERSONAL/UAM/TFM/ServidorArchivos/";
            Resource resource = this.resourceRepository.findByIdentification(identification);
            if (resource == null) {
                this.errorMsg = "Error al duplicar recurso no existente !";
                throw new InsertException(Resource.class.getSimpleName(), this.errorMsg);
            }
            String path = email + "/PRIVATE/" + resource.getName() + "/";
            Resource dupResource = new Resource();
            dupResource.setEmailOwner(email);
            dupResource.setType("PRIVATE");
            dupResource.setName(resource.getName());
            dupResource.setDescription(resource.getDescription());
            dupResource.setActivity(resource.getActivity());
            dupResource.setImgLocation(path + resource.getImgLocation().split("/")[3]);
            dupResource.setAudioLocation(path + resource.getAudioLocation().split("/")[3]);
            dupResource.setCategory(resource.getCategory());
            dupResource.setIdentification(email + "/PRIVATE/" + resource.getName().replaceAll(" ", ""));
            this.resourceRepository.insert(dupResource);
            this.checkDirectory(directory + path);
            String imageOriginalPath = directory + resource.getImgLocation();
            String audioOriginalPath = directory + resource.getAudioLocation();
            String imageCopyPath = directory + path + resource.getImgLocation().split("/")[3];
            String audioCopyPath = directory + path + resource.getAudioLocation().split("/")[3];
            this.duplicate(imageOriginalPath, audioOriginalPath, imageCopyPath, audioCopyPath);
        } catch (Exception ex) {
            log.error("Error duplicating resource: " + ex);
        }
    }

    public void deleteResource(String identification) throws DocumentNotFoundException {
        try {
            Resource resource = this.resourceRepository.findByIdentification(identification);
        } catch (Exception ex) {

        }
    }

    public List<String> getDataOfFileActivity(MultipartFile multipartFile) throws Exception {
        try {
            log.info("Getting data from file");
            String tempPath = "/TFM/temp";
            String filePath = "/" + multipartFile.getOriginalFilename();
            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("C:/TFM/tesseract/tessdata");
            tesseract.setLanguage("spa");
            this.checkDirectory(tempPath);
            this.saveFile(multipartFile, tempPath + filePath);
            File file = new File("C:" + tempPath + filePath);
            String text = tesseract.doOCR(file);
            String[] dataFile = text.split("\n");
            List<String> data = new ArrayList<>(Arrays.asList(dataFile));
            List<String> cleanData = new ArrayList<String>();
            data.forEach(line -> {
                String cleanLine = this.cleanTextContent(line);
                if (!cleanLine.equals("")) {
                    cleanData.add(cleanLine);
                }
            });
            if (cleanData.isEmpty()) {
                log.error("Error no content to process");
                throw new Exception("Error no content to process");
            }
            return cleanData;
        } catch (Exception ex) {
            throw new Exception("Error processing file");
        }
    }

    private String cleanTextContent(String text) {
        String clean = text.replaceAll("[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s.!?¡¿_-]|([.!?¡¿_-])\\1+|([.!?¡¿_-]{2,})", "");
        clean = clean.trim().replaceAll("\\s+", " ");
        return clean;
    }

    public List<String> getAllCategories() throws DocumentNotFoundException {
        try {
            log.info("Getting all categories");
            List<Resource> resources = this.resourceRepository.findAll();
            List<String> categories = new ArrayList<String>();
            resources.forEach(resource -> {
                resource.getCategory().forEach(category -> {
                    if (!categories.contains(category)) {
                        categories.add(category);
                    }
                });
            });
            return categories;
        } catch (Exception ex) {
            log.error("Error getting all categories: " + ex);
            throw new DocumentNotFoundException("Error getting categories");
        }
    }


    public List<Resource> getAllPublicResources() throws DocumentNotFoundException {
        try {
            log.info("Getting all public resources.");
            List<Resource> resources = this.resourceRepository.findByType("PUBLIC");
            if (resources == null) {
                this.errorMsg = "No existen recursos públicos !";
                log.error("Doen't exist any public resources");
                throw new DocumentNotFoundException(this.errorMsg);
            }
            return resources;
        } catch (Exception ex) {
            log.error("Getting public resources failed: " + ex);
            if (this.errorMsg != null) {
                throw new DocumentNotFoundException(this.errorMsg);
            } else {
                throw new DocumentNotFoundException("Error obteniendo recursos");
            }
        }
    }

    public List<Resource> getResourcesByOwnerAndType(String owner, String type) throws DocumentNotFoundException {
        try {
            log.info("Getting resources by type/owner: " + type + "/" + owner);
            List<Resource> resources = this.resourceRepository.findByEmailOwnerAndType(owner, type);
            if (resources == null) {
                log.error("Doesn't exist any resources ");
                this.errorMsg = "No existen recursos !";
                throw new DocumentNotFoundException(this.errorMsg);
            }
            return resources;
        } catch (Exception ex) {
            log.error("Getting resources by type and owner failed: " + ex);
            if (this.errorMsg != null) {
                throw new DocumentNotFoundException(this.errorMsg);
            } else {
                throw new DocumentNotFoundException("Error obteniendo recursos");
            }
        }
    }

    public List<Resource> getPublicResourcesByNameLike(String name) throws DocumentNotFoundException {
        try {
            log.info("Getting  public resources by name like: " + name);
            List<Resource> resources = this.resourceRepository.findByNameLikeAndType(name, "PUBLIC");
            if (resources == null) {
                this.errorMsg = "";
                throw new DocumentNotFoundException(this.errorMsg);
            }
            return resources;
        } catch (DocumentNotFoundException ex) {
            log.error("Getting public resources by name failed: " + ex);
            if (this.errorMsg != null) {
                throw new DocumentNotFoundException(this.errorMsg);
            } else {
                throw new DocumentNotFoundException("Error obteniendo recursos publicos por nombre");
            }
        }
    }

    public List<Resource> getPrivateResourcesByNameLike(String name, String email) throws DocumentNotFoundException {
        try {
            log.info("Getting private resources by name like: " + name + " / from: " + email);
            List<Resource> resources = this.resourceRepository.findByNameLikeAndTypeAndEmailOwner(name, "PRIVATE", email);
            if (resources == null) {
                this.errorMsg = "";
                throw new DocumentNotFoundException(this.errorMsg);
            }
            return resources;
        } catch (DocumentNotFoundException ex) {
            log.error("Getting private resources by name failed: " + ex);
            if (this.errorMsg != null) {
                throw new DocumentNotFoundException(this.errorMsg);
            } else {
                throw new DocumentNotFoundException("Error obteniendo recursos privados por nombre");
            }
        }
    }

    private void duplicate(String imageOriginalPath, String audioOriginalPath,
                           String imageCopyPath, String audioCopyPath) throws IOException {
        File originalImg = new File(imageOriginalPath);
        File duplicateImg = new File(imageCopyPath);
        this.duplicateFile(originalImg, duplicateImg);
        File originalAudio = new File(audioOriginalPath);
        File duplicateAudio = new File(audioCopyPath);
        this.duplicateFile(originalAudio, duplicateAudio);
    }

    private void duplicateFile(File original, File duplicate) throws IOException {
        FileInputStream fis = new FileInputStream(original);
        FileOutputStream fos = new FileOutputStream(duplicate);
        byte[] buffer = new byte[1024];
        int length;
        while ((length = fis.read(buffer)) > 0) {
            fos.write(buffer, 0, length);
        }
        fis.close();
        fos.close();
    }

    private void saveFile(MultipartFile file, String filePath) throws IOException {
        byte[] bytes = file.getBytes();
        File newFile = new File(filePath);
        FileOutputStream fos = new FileOutputStream(newFile);
        fos.write(bytes);
        fos.close();
    }

    private void checkDirectory(String path) {
        File directory = new File(path);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }
}
