-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "hint" TEXT,
    "details" TEXT
);

-- CreateTable
CREATE TABLE "answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "question_answer" TEXT NOT NULL,
    CONSTRAINT "answer_question_answer_fkey" FOREIGN KEY ("question_answer") REFERENCES "questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_tests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "passed" BOOLEAN,
    "generated_timestamp" DATETIME NOT NULL,
    "started_timestamp" DATETIME,
    CONSTRAINT "user_tests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "test_question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answered" BOOLEAN NOT NULL,
    "question_id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    CONSTRAINT "test_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "test_question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "user_tests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "test_answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answer_id" TEXT NOT NULL,
    "test_question_id" TEXT NOT NULL,
    CONSTRAINT "test_answer_test_question_id_fkey" FOREIGN KEY ("test_question_id") REFERENCES "test_question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "questions_text_key" ON "questions"("text");
