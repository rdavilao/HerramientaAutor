package es.uam.tfm.resources.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "resource")
public class Resource {

    @Id
    private String _id;

    private String emailOwner;

    private String type;

    private String name;

    private String description;

    private String imgLocation;

    private String audioLocation;

    private Activity activity;

    private List<String> category;
    @Indexed(name = "idx_identification", unique = true)
        private String identification;

}

