package es.uam.tfm.resources.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnirCRecord {

    private String key;
    private String keyImg;
    private String keyAudio;
    private String definition;
    private String definitionImg;
    private String definitionAudio;
}
