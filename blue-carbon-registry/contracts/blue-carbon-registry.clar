;; Blue Carbon Registry - Fixed Version
(define-data-var counter uint u0)

(define-map projects
  { id: uint }
  {
    name: (string-ascii 100),
    owner: principal
  }
)

(define-event project-registered (id uint name (string-ascii 100) owner principal))

(define-public (register-project (name (string-ascii 100)))
  (begin
    (let
      (
        (project-id (+ (var-get counter) u1))
      )
      (begin
        (map-set projects { id: project-id }
          {
            name: name,
            owner: tx-sender
          }
        )
        (var-set counter project-id)
        (emit-event (project-registered project-id name tx-sender))
        (ok project-id)
      )
    )
  )
)

(define-read-only (get-project (id uint))
  (map-get? projects { id: id })
)

(define-read-only (get-total-projects)
  (var-get counter)
)
