package shopping.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProductRequest {

    private String description;
    private String name;
    private Integer quantity;
    private Double retailPrice;
    private Double wholesalePrice;
}
