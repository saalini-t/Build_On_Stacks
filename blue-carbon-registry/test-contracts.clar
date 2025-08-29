;; -------------------------------------------------
;; Test Script for Blue Carbon Registry Contracts
;; -------------------------------------------------
;; Run these commands in Clarinet console to test functionality
;; -------------------------------------------------

;; =================================================
;; INITIALIZATION TESTS
;; =================================================

;; 1. Set up verifiers and initial state
(contract-call? .blue-carbon-registry set-verifier tx-sender)
(contract-call? .blue-carbon-marketplace set-trading-fee u50)
(contract-call? .sensor-verification add-verifier tx-sender u1)

;; =================================================
;; BLUE CARBON REGISTRY TESTS
;; =================================================

;; 2. Register a new project
(contract-call? .blue-carbon-registry register-project "Mangrove Restoration Project")

;; 3. Check project details
(contract-call? .blue-carbon-registry get-project u1)

;; 4. Verify the project (as verifier)
(contract-call? .blue-carbon-registry verify-project u1)

;; 5. Mint carbon credits
(contract-call? .blue-carbon-registry mint-credits u1 u100)

;; 6. Check updated project
(contract-call? .blue-carbon-registry get-project u1)

;; =================================================
;; SENSOR VERIFICATION TESTS
;; =================================================

;; 7. Register a new sensor
(contract-call? .sensor-verification register-sensor "sensor-001" u1 "co2" "Mumbai Coast")

;; 8. Record sensor reading
(contract-call? .sensor-verification record-reading "sensor-001" "25.5" "ppm")

;; 9. Verify sensor reading
(contract-call? .sensor-verification verify-reading "sensor-001" (block-height))

;; 10. Check sensor details
(contract-call? .sensor-verification get-sensor "sensor-001")

;; =================================================
;; MARKETPLACE TESTS
;; =================================================

;; 11. Create a sell order
(contract-call? .blue-carbon-marketplace create-sell-order u1 u50 u1750)

;; 12. Check order details
(contract-call? .blue-carbon-marketplace get-order u1)

;; 13. Check total orders
(contract-call? .blue-carbon-marketplace get-total-orders)

;; =================================================
;; INTEGRATION TESTS
;; =================================================

;; 14. Register another project
(contract-call? .blue-carbon-registry register-project "Seagrass Protection Project")

;; 15. Register sensor for second project
(contract-call? .sensor-verification register-sensor "sensor-002" u2 "biomass" "Goa Coast")

;; 16. Record and verify reading for second sensor
(contract-call? .sensor-verification record-reading "sensor-002" "145.6" "t/ha")
(contract-call? .sensor-verification verify-reading "sensor-002" (block-height))

;; =================================================
;; VERIFICATION TESTS
;; =================================================

;; 17. Check total projects
(contract-call? .blue-carbon-registry get-total-projects)

;; 18. Check total sensors
(contract-call? .sensor-verification get-total-sensors)

;; 19. Check if current user is verifier
(contract-call? .sensor-verification is-verifier tx-sender)

;; =================================================
;; EXPECTED RESULTS
;; =================================================
;; 
;; All commands should return (ok ...) or (some ...) for successful operations
;; 
;; Project 1: "Mangrove Restoration Project" with 100 credits
;; Project 2: "Seagrass Protection Project" with 0 credits
;; Sensor 1: "sensor-001" for CO2 monitoring
;; Sensor 2: "sensor-002" for biomass monitoring
;; Order 1: 50 credits for sale at 1750 microSTX each
;; 
;; Total Projects: 2
;; Total Sensors: 2
;; Total Orders: 1
;; 
;; =================================================
