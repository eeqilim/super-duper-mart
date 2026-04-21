package shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PurchasedProductDto {
    private Long productId;
    private String productName;
    private String description;
    private Integer quantity;
    private Double purchasedPrice;
}
