#!/bin/bash

BASE_URL="http://localhost:8080"
TODO_ID_PLACEHOLDER="123e4567-e89b-12d3-a456-426614174000"
USER_ID_PLACEHOLDER="1"

# Expected ServiceResponse structure:
# {
#   "success": true,
#   "message": "Descriptive message",
#   "responseObject": { /* Actual data: Todo, User, Todo[], User[], or null */ },
#   "statusCode": 200 // or 201, etc.
# }
# For DELETE /todos/{id}, expected: Empty body, 204 No Content

echo "### Health Check ###"
# Expected: { "success": true, "message": "Service is healthy", "responseObject": null, "statusCode": 200 }
curl -X GET "${BASE_URL}/health-check"
echo -e "\n"

echo "### Get Users ###"
# Expected: { "success": true, "message": "Users retrieved successfully", "responseObject": [ ...users ], "statusCode": 200 }
curl -X GET "${BASE_URL}/users"
echo -e "\n"

echo "### Get User by ID ###"
# Expected: { "success": true, "message": "User retrieved successfully", "responseObject": { ...user }, "statusCode": 200 }
curl -X GET "${BASE_URL}/users/${USER_ID_PLACEHOLDER}"
echo -e "\n"

echo "### Create Todo ###"
# Expected: { "success": true, "message": "Todo created successfully", "responseObject": { ...new_todo }, "statusCode": 201 }
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn API Testing", "isDone": false}' \
  "${BASE_URL}/todos"
echo -e "\n"

echo "### Get Todos ###"
# Expected: { "success": true, "message": "Todos retrieved successfully", "responseObject": [ ...todos ], "statusCode": 200 }
curl -X GET "${BASE_URL}/todos"
echo -e "\n"

echo "### Get Todo by ID ###"
# Expected: { "success": true, "message": "Todo retrieved successfully", "responseObject": { ...todo }, "statusCode": 200 }
curl -X GET "${BASE_URL}/todos/${TODO_ID_PLACEHOLDER}"
echo -e "\n"

echo "### Update Todo by ID ###"
# Expected: { "success": true, "message": "Todo updated successfully", "responseObject": { ...updated_todo }, "statusCode": 200 }
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{"text": "Master API Testing", "isDone": true}' \
  "${BASE_URL}/todos/${TODO_ID_PLACEHOLDER}"
echo -e "\n"

echo "### Delete Todo by ID ###"
# Expected: Empty body, Status 204
curl -X DELETE "${BASE_URL}/todos/${TODO_ID_PLACEHOLDER}" -v
echo -e "\n"