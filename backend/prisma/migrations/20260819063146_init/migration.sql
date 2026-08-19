-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'LABBOY');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('BOOKED', 'ASSIGNED', 'COLLECTED', 'PROCESSING', 'READY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "staffCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "username" TEXT,
    "passwordHash" TEXT,
    "pin" TEXT,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'BOOKED',
    "patientName" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "patientAddress" TEXT NOT NULL,
    "patientAge" TEXT NOT NULL DEFAULT '',
    "patientGender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "preferredDate" TEXT NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "assignedTo" TEXT,
    "collectionNotes" TEXT NOT NULL DEFAULT '',
    "collectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_tests" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,

    CONSTRAINT "booking_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "remarks" TEXT NOT NULL DEFAULT '',
    "reportedBy" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_staffCode_key" ON "staff"("staffCode");

-- CreateIndex
CREATE UNIQUE INDEX "staff_username_key" ON "staff"("username");

-- CreateIndex
CREATE UNIQUE INDEX "booking_tests_bookingId_testId_key" ON "booking_tests"("bookingId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "reports_bookingId_key" ON "reports"("bookingId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_tests" ADD CONSTRAINT "booking_tests_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
