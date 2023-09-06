package es.uam.tfm.resources.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class ResourceRQ {

    private String emailOwner;

    private String type;

    private String name;

    private List<String> category;
}
