package shopping.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "watchlist")
@IdClass(Watchlist.WatchlistId.class)
public class Watchlist {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    @Column(name = "product_id")
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    public Watchlist(Long userId, Long productId) {
        this.userId = userId;
        this.productId = productId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class WatchlistId implements Serializable {
        private Long userId;
        private Long productId;
    }
}
