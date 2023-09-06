package es.uam.tfm.resources.repository;

import es.uam.tfm.resources.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    Resource findByIdentification(String identification);

    List<Resource> findByType(String type);

    List<Resource> findByCategoryAndType(String category, String type);

    List<Resource> findByNameAndType(String name, String type);

    List<Resource> findByEmailOwnerAndType(String emailOwner, String type);

    List<Resource> findByNameLikeAndType(String name, String type);

    List<Resource> findByNameLikeAndTypeAndEmailOwner(String name, String type, String emailOwner);
}
