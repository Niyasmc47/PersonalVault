package com.personalvault.transaction;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.personalvault.dto.auth.RegisterRequest;
import com.personalvault.dto.transaction.CreateTransactionRequest;
import com.personalvault.dto.transaction.UpdateTransactionRequest;
import com.personalvault.entity.transaction.PaymentMethod;
import com.personalvault.entity.transaction.TransactionCategory;
import com.personalvault.entity.transaction.TransactionType;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.transaction.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.servlet.http.Cookie;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TransactionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll();
        userRepository.deleteAll();
    }

    // ── Helper: register a user and return JWT token ──────────────

    private Cookie registerAndGetCookie(String name, String email) throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName(name);
        req.setEmail(email);
        req.setPassword("password123");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        return result.getResponse().getCookie("jwt");
    }

    private CreateTransactionRequest buildExpenseRequest() {
        CreateTransactionRequest req = new CreateTransactionRequest();
        req.setType(TransactionType.EXPENSE);
        req.setAmount(new BigDecimal("500.00"));
        req.setCategory(TransactionCategory.FOOD);
        req.setDescription("Lunch");
        req.setTransactionDate(LocalDate.of(2026, 8, 15));
        req.setPaymentMethod(PaymentMethod.UPI);
        return req;
    }

    private CreateTransactionRequest buildIncomeRequest() {
        CreateTransactionRequest req = new CreateTransactionRequest();
        req.setType(TransactionType.INCOME);
        req.setAmount(new BigDecimal("50000.00"));
        req.setCategory(TransactionCategory.SALARY);
        req.setDescription("Monthly salary");
        req.setTransactionDate(LocalDate.of(2026, 8, 1));
        req.setPaymentMethod(PaymentMethod.BANK_TRANSFER);
        return req;
    }

    // ── 1. Create Expense ─────────────────────────────────────────

    @Test
    void testCreateExpense() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User1", "user1@test.com");

        mockMvc.perform(post("/api/transactions")
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildExpenseRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.type").value("EXPENSE"))
                .andExpect(jsonPath("$.amount").value(500.00))
                .andExpect(jsonPath("$.category").value("FOOD"))
                .andExpect(jsonPath("$.id").exists());
    }

    // ── 2. Create Income ──────────────────────────────────────────

    @Test
    void testCreateIncome() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User2", "user2@test.com");

        mockMvc.perform(post("/api/transactions")
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildIncomeRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.type").value("INCOME"))
                .andExpect(jsonPath("$.amount").value(50000.00))
                .andExpect(jsonPath("$.category").value("SALARY"));
    }

    // ── 3. Retrieve Transactions ──────────────────────────────────

    @Test
    void testGetTransactions() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User3", "user3@test.com");

        // Create two transactions
        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildExpenseRequest())));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildIncomeRequest())));

        mockMvc.perform(get("/api/transactions")
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // ── 4. Retrieve Single Transaction ────────────────────────────

    @Test
    void testGetTransactionById() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User4", "user4@test.com");

        MvcResult createResult = mockMvc.perform(post("/api/transactions")
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildExpenseRequest())))
                .andExpect(status().isCreated())
                .andReturn();

        Long id = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(get("/api/transactions/" + id)
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.category").value("FOOD"));
    }

    // ── 5. Update Transaction ─────────────────────────────────────

    @Test
    void testUpdateTransaction() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User5", "user5@test.com");

        MvcResult createResult = mockMvc.perform(post("/api/transactions")
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildExpenseRequest())))
                .andExpect(status().isCreated())
                .andReturn();

        Long id = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("id").asLong();

        UpdateTransactionRequest updateReq = new UpdateTransactionRequest();
        updateReq.setType(TransactionType.EXPENSE);
        updateReq.setAmount(new BigDecimal("750.00"));
        updateReq.setCategory(TransactionCategory.TRANSPORT);
        updateReq.setDescription("Uber ride");
        updateReq.setTransactionDate(LocalDate.of(2026, 8, 16));
        updateReq.setPaymentMethod(PaymentMethod.CARD);

        mockMvc.perform(put("/api/transactions/" + id)
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(750.00))
                .andExpect(jsonPath("$.category").value("TRANSPORT"));
    }

    // ── 6. Delete Transaction ─────────────────────────────────────

    @Test
    void testDeleteTransaction() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User6", "user6@test.com");

        MvcResult createResult = mockMvc.perform(post("/api/transactions")
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildExpenseRequest())))
                .andExpect(status().isCreated())
                .andReturn();

        Long id = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(delete("/api/transactions/" + id)
                        .cookie(jwtCookie))
                .andExpect(status().isNoContent());

        // Verify it's gone
        mockMvc.perform(get("/api/transactions/" + id)
                        .cookie(jwtCookie))
                .andExpect(status().isNotFound());
    }

    // ── 7. Unauthenticated Requests Rejected ──────────────────────

    @Test
    void testUnauthenticatedRequestRejected() throws Exception {
        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildExpenseRequest())))
                .andExpect(status().isUnauthorized());
    }

    // ── 8. User A Cannot Read User B's Transaction ────────────────

    @Test
    void testUserCannotReadOtherUsersTransaction() throws Exception {
        Cookie tokenA = registerAndGetCookie("UserA", "userA@test.com");
        Cookie tokenB = registerAndGetCookie("UserB", "userB@test.com");

        MvcResult createResult = mockMvc.perform(post("/api/transactions")
                        .cookie(tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildExpenseRequest())))
                .andExpect(status().isCreated())
                .andReturn();

        Long idB = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("id").asLong();

        // User A tries to read User B's transaction
        mockMvc.perform(get("/api/transactions/" + idB)
                        .cookie(tokenA))
                .andExpect(status().isNotFound());
    }

    // ── 9. User A Cannot Update User B's Transaction ──────────────

    @Test
    void testUserCannotUpdateOtherUsersTransaction() throws Exception {
        Cookie tokenA = registerAndGetCookie("UserA2", "userA2@test.com");
        Cookie tokenB = registerAndGetCookie("UserB2", "userB2@test.com");

        MvcResult createResult = mockMvc.perform(post("/api/transactions")
                        .cookie(tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildExpenseRequest())))
                .andExpect(status().isCreated())
                .andReturn();

        Long idB = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("id").asLong();

        UpdateTransactionRequest updateReq = new UpdateTransactionRequest();
        updateReq.setType(TransactionType.EXPENSE);
        updateReq.setAmount(new BigDecimal("9999.00"));
        updateReq.setCategory(TransactionCategory.SHOPPING);
        updateReq.setDescription("Hacked");
        updateReq.setTransactionDate(LocalDate.of(2026, 8, 20));
        updateReq.setPaymentMethod(PaymentMethod.CASH);

        // User A tries to update User B's transaction
        mockMvc.perform(put("/api/transactions/" + idB)
                        .cookie(tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isNotFound());
    }

    // ── 10. User A Cannot Delete User B's Transaction ─────────────

    @Test
    void testUserCannotDeleteOtherUsersTransaction() throws Exception {
        Cookie tokenA = registerAndGetCookie("UserA3", "userA3@test.com");
        Cookie tokenB = registerAndGetCookie("UserB3", "userB3@test.com");

        MvcResult createResult = mockMvc.perform(post("/api/transactions")
                        .cookie(tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildExpenseRequest())))
                .andExpect(status().isCreated())
                .andReturn();

        Long idB = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(delete("/api/transactions/" + idB)
                        .cookie(tokenA))
                .andExpect(status().isNotFound());
    }

    // ── 11. Zero Amount Rejected ──────────────────────────────────

    @Test
    void testZeroAmountRejected() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User11", "user11@test.com");

        CreateTransactionRequest req = buildExpenseRequest();
        req.setAmount(BigDecimal.ZERO);

        mockMvc.perform(post("/api/transactions")
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    // ── 12. Negative Amount Rejected ──────────────────────────────

    @Test
    void testNegativeAmountRejected() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User12", "user12@test.com");

        CreateTransactionRequest req = buildExpenseRequest();
        req.setAmount(new BigDecimal("-100.00"));

        mockMvc.perform(post("/api/transactions")
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    // ── 13. Invalid Category Rejected (via JSON parsing) ──────────

    @Test
    void testInvalidCategoryRejected() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User13", "user13@test.com");

        String json = """
                {
                    "type": "EXPENSE",
                    "amount": 100,
                    "category": "INVALID_CATEGORY",
                    "transactionDate": "2026-08-15",
                    "paymentMethod": "CASH"
                }
                """;

        mockMvc.perform(post("/api/transactions")
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    // ── 14. Invalid Category/Type Combination Rejected ────────────

    @Test
    void testInvalidCategoryTypeCombinationRejected() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User14", "user14@test.com");

        // SALARY is an income category, not valid for EXPENSE
        CreateTransactionRequest req = buildExpenseRequest();
        req.setCategory(TransactionCategory.SALARY);

        mockMvc.perform(post("/api/transactions")
                        .cookie(jwtCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    // ── 15. Summary: Income Calculated Correctly ──────────────────

    @Test
    void testSummaryIncomeCorrect() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User15", "user15@test.com");

        CreateTransactionRequest income1 = buildIncomeRequest();
        income1.setAmount(new BigDecimal("30000.00"));

        CreateTransactionRequest income2 = buildIncomeRequest();
        income2.setAmount(new BigDecimal("20000.00"));
        income2.setCategory(TransactionCategory.FREELANCE);

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(income1)));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(income2)));

        mockMvc.perform(get("/api/transactions/summary")
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalIncome").value(50000.00));
    }

    // ── 16. Summary: Expenses Calculated Correctly ────────────────

    @Test
    void testSummaryExpensesCorrect() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User16", "user16@test.com");

        CreateTransactionRequest exp1 = buildExpenseRequest();
        exp1.setAmount(new BigDecimal("2000.00"));

        CreateTransactionRequest exp2 = buildExpenseRequest();
        exp2.setAmount(new BigDecimal("1500.00"));
        exp2.setCategory(TransactionCategory.TRANSPORT);

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(exp1)));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(exp2)));

        mockMvc.perform(get("/api/transactions/summary")
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalExpenses").value(3500.00));
    }

    // ── 17. Balance = Income - Expenses ───────────────────────────

    @Test
    void testBalanceCalculation() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User17", "user17@test.com");

        CreateTransactionRequest income = buildIncomeRequest();
        income.setAmount(new BigDecimal("50000.00"));

        CreateTransactionRequest expense = buildExpenseRequest();
        expense.setAmount(new BigDecimal("32500.00"));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(income)));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expense)));

        mockMvc.perform(get("/api/transactions/summary")
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalIncome").value(50000.00))
                .andExpect(jsonPath("$.totalExpenses").value(32500.00))
                .andExpect(jsonPath("$.balance").value(17500.00))
                .andExpect(jsonPath("$.transactionCount").value(2));
    }

    // ── 18. Category Summary Works ────────────────────────────────

    @Test
    void testCategorySummary() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User18", "user18@test.com");

        CreateTransactionRequest food1 = buildExpenseRequest();
        food1.setAmount(new BigDecimal("300.00"));

        CreateTransactionRequest food2 = buildExpenseRequest();
        food2.setAmount(new BigDecimal("200.00"));

        CreateTransactionRequest transport = buildExpenseRequest();
        transport.setAmount(new BigDecimal("500.00"));
        transport.setCategory(TransactionCategory.TRANSPORT);

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(food1)));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(food2)));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transport)));

        mockMvc.perform(get("/api/transactions/category-summary")
                        .cookie(jwtCookie)
                        .param("type", "EXPENSE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // ── 19. Date Filtering Works ──────────────────────────────────

    @Test
    void testDateFiltering() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User19", "user19@test.com");

        CreateTransactionRequest augTx = buildExpenseRequest();
        augTx.setTransactionDate(LocalDate.of(2026, 8, 15));

        CreateTransactionRequest julTx = buildExpenseRequest();
        julTx.setTransactionDate(LocalDate.of(2026, 7, 10));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(augTx)));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(julTx)));

        // Filter for August only
        mockMvc.perform(get("/api/transactions")
                        .cookie(jwtCookie)
                        .param("startDate", "2026-08-01")
                        .param("endDate", "2026-08-31"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    // ── 20. Type Filtering Works ──────────────────────────────────

    @Test
    void testTypeFiltering() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User20", "user20@test.com");

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildExpenseRequest())));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildIncomeRequest())));

        // Filter for EXPENSE only
        mockMvc.perform(get("/api/transactions")
                        .cookie(jwtCookie)
                        .param("type", "EXPENSE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].type").value("EXPENSE"));
    }

    // ── 21. Category Filtering Works ──────────────────────────────

    @Test
    void testCategoryFiltering() throws Exception {
        Cookie jwtCookie = registerAndGetCookie("User21", "user21@test.com");

        CreateTransactionRequest food = buildExpenseRequest();
        food.setCategory(TransactionCategory.FOOD);

        CreateTransactionRequest transport = buildExpenseRequest();
        transport.setCategory(TransactionCategory.TRANSPORT);

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(food)));

        mockMvc.perform(post("/api/transactions")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transport)));

        mockMvc.perform(get("/api/transactions")
                        .cookie(jwtCookie)
                        .param("category", "FOOD"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].category").value("FOOD"));
    }
}
