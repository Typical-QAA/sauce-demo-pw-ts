# Test Assumptions and Reasoning

## Purpose of This Document

This document explains how test scenarios were interpreted and implemented, including assumptions made due to missing details, underspecified steps, or limitations of the application under test.

Before implementation, the application was reviewed through exploratory testing to understand real behavior and constraints.

## Web Automation – Assumptions

<https://www.saucedemo.com/>

### Scenario_1: Successful login using standard_user

#### Assumption

A successful login is validated by:

- navigation to the inventory page,
- correct inventory page URL,
- presence of the inventory header and product list.

#### Reasoning

- The scenario does not define what “successful” means.
- Reaching the inventory page is the primary and stable success indicator after login.
- Additional UI elements (header title, items list) confirm that the page is fully loaded and usable.

### Scenario_2: Failed login using locked_out_user

#### Assumption

Login failure is validated by:

- visible error message,
- correct error text for locked-out user,
- login inputs marked with error-related CSS classes.

#### Reasoning

- The scenario only states that login should fail, without defining failure criteria.
- The application provides a clear and deterministic error message for locked_out_user.
- Input field error styling is a secondary but reliable indicator of failure state.

### Scenario_3: Add a product to the cart

#### Ambiguity

The scenario does not specify:

- which product should be added,
- from which page (inventory list or item details),
- how success should be validated.

#### Assumptions

- A single product is added from the inventory list page.
- The product is selected randomly to avoid hard-coding test data.
- Success is validated by:
  - opening the cart page,
  - confirming exactly one item is present,
  - validating item name, description, price, and quantity.

#### Reasoning

- Adding from the inventory page is the shortest and most common user flow.
- Random selection increases test robustness and avoids coupling to specific products.
- Cart content validation ensures the action had the intended effect.

### Scenario_4: Start the checkout process

#### Observed behavior

- Checkout can start without at least one item in the cart.
- The above is intentional invalid behavior.
- Checkout Step One (checkout-step-one.html) requires shipping data before proceeding.
- Empty shipping data triggers sequential validation errors.

#### Assumptions and implementation approach

- At least one product must be added to the cart before checkout.
- Clicking the Checkout button from the cart page is considered “starting the checkout process”.
- Attempting to continue with empty shipping fields should:
  - display appropriate validation errors,
  - prevent navigation to Checkout Overview.
- Providing valid shipping data allows navigation to Checkout Overview.

#### Reasoning

- The scenario does not define how far the checkout process should proceed.
- Validating both negative (empty data) and positive (valid data) paths demonstrates understanding of application behavior.
- This approach reflects realistic user interaction and form validation flow.

## General Observations

- Several scenarios are high-level and require clarification through assumptions.
- The application enforces client-side validation that is not mentioned in the task.
- Web app lacks strong validations (checkout form, cart limits).
- Where behavior was not explicitly defined, the most deterministic and user-realistic interpretation was applied.
- Additional negative tests were implemented to document application limitations, even when not explicitly required.
