;; Sensor Verification Contract
(define-data-var sensor-counter uint u0)

(define-map sensors
  { id: (string-ascii 50) }
  {
    owner: principal,
    project-id: uint,
    sensor-type: (string-ascii 30),
    location: (string-ascii 100)
  }
)

(define-map readings
  { sensor-id: (string-ascii 50), timestamp: uint }
  {
    value: (string-ascii 50),
    unit: (string-ascii 20),
    verified: bool
  }
)

;; Register a new sensor
(define-public (register-sensor (id (string-ascii 50)) (project-id uint) (sensor-type (string-ascii 30)) (location (string-ascii 100)))
  (begin
    (map-set sensors { id: id }
      {
        owner: tx-sender,
        project-id: project-id,
        sensor-type: sensor-type,
        location: location
      }
    )
    (var-set sensor-counter (+ (var-get sensor-counter) u1))
    (print { event: "sensor-registered", id: id, owner: tx-sender, project-id: project-id })
    (ok true)
  )
)

;; Record a new reading
(define-public (record-reading (sensor-id (string-ascii 50)) (value (string-ascii 50)) (unit (string-ascii 20)))
  (let
    (
      (sensor (unwrap! (map-get? sensors { id: sensor-id }) (err u300)))
      (current-time (block-height))
    )
    (if (is-eq (get owner sensor) tx-sender)
        (begin
          (map-set readings { sensor-id: sensor-id, timestamp: current-time }
            {
              value: value,
              unit: unit,
              verified: false
            }
          )
          (print { event: "reading-recorded", sensor-id: sensor-id, value: value, timestamp: current-time })
          (ok true)
        )
        (err u100)
    )
  )
)

;; Read-only functions
(define-read-only (get-sensor (id (string-ascii 50)))
  (map-get? sensors { id: id })
)

(define-read-only (get-reading (sensor-id (string-ascii 50)) (timestamp uint))
  (map-get? readings { sensor-id: sensor-id, timestamp: timestamp })
)

(define-read-only (get-total-sensors)
  (var-get sensor-counter)
)
