package es.uam.tfm.resources.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnirCActivity extends Activity {

    private List<UnirCRecord> records;

}
