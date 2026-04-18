package shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductDto {

    private Long productId;
    private String description;
    private String productName;
    private Integer quantity;
    private Double retailPrice;
    private Double wholesalePrice;
}
