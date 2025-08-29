;; Blue Carbon Marketplace
(define-data-var order-counter uint u0)

(define-map orders
  { id: uint }
  {
    seller: principal,
    project-id: uint,
    amount: uint,
    price: uint,
    active: bool
  }
)

(define-event order-created (id uint seller principal project-id uint amount uint price uint))

(define-public (create-sell-order (project-id uint) (amount uint) (price uint))
  (let
    (
      (order-id (+ (var-get order-counter) u1))
    )
    (begin
      (map-set orders { id: order-id }
        {
          seller: tx-sender,
          project-id: project-id,
          amount: amount,
          price: price,
          active: true
        }
      )
      (var-set order-counter order-id)
      (emit-event (order-created order-id tx-sender project-id amount price))
      (ok order-id)
    )
  )
)

(define-read-only (get-order (order-id uint))
  (map-get? orders { id: order-id })
)

(define-read-only (get-total-orders)
  (var-get order-counter)
)
