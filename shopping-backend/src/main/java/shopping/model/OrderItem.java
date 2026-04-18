package shopping.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "purchased_price", nullable = false)
    private Double purchasedPrice;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "wholesale_price", nullable = false)
    private Double wholesalePrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public OrderItem(Double purchasedPrice, Double wholesalePrice, Integer quantity, Order order, Product product) {
        this.purchasedPrice = purchasedPrice;
        this.wholesalePrice = wholesalePrice;
        this.quantity = quantity;
        this.order = order;
        this.product = product;
    }
}
