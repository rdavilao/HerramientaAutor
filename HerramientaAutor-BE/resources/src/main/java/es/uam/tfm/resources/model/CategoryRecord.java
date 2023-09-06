package es.uam.tfm.resources.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRecord {

    private String category;

    private String categoryImg;

    private String categoryAudio;

    private List<CategoryElement> elements;
}
