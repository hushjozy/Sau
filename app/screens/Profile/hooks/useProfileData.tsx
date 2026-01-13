// File: @/services/hooks/useProfileData.ts

import { useState, useEffect } from "react";
import {
  getGivenAppreciations,
  getReceivedAppreciations,
} from "@/services/api/appreciationServices";
import {
  getCurrentUserRecognitions,
} from "@/services/api/recognitionServices";
import {
  getMyTransactions,
} from "@/services/api/pointTransactionServices";
import {
  getTotalApprovedAwardPointsMe,
} from "@/services/api/nominationServices";
import { User } from "@/services/models/userProfile";
import { AppreciationDto } from "@/services/models/appreciationDto";
import { RecognitionListResponse } from "@/services/models/recognitionDto";
import { PointTransactionDto } from "@/services/models/pointTransactionDto";
import { UpdateProfileVm } from "@/services/models/requests/updateProfileVm";
import { getCurrentUser, getUserPoints, updateProfile, uploadImage } from "@/services/api/users";

interface UseProfileDataResult {
  currentUser: User | null;
  userPoints: number;
  totalApprovedPoints: number;
  givenAppreciations: AppreciationDto[];
  receivedAppreciations: AppreciationDto[];
  recognitions: RecognitionListResponse[];
  transactions: PointTransactionDto[];
  loading: boolean;
  error: string | null;
  updateUserProfile: (data: UpdateProfileVm) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
  loadMoreGiven: () => void;
  loadMoreReceived: () => void;
  loadMoreRecognitions: () => void;
  loadMoreTransactions: () => void;
  refetch: () => Promise<void>;
}

export const useProfileData = (): UseProfileDataResult => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [totalApprovedPoints, setTotalApprovedPoints] = useState(0);
  const [givenAppreciations, setGivenAppreciations] = useState<AppreciationDto[]>([]);
  const [receivedAppreciations, setReceivedAppreciations] = useState<AppreciationDto[]>([]);
  const [recognitions, setRecognitions] = useState<RecognitionListResponse[]>([]);
  const [transactions, setTransactions] = useState<PointTransactionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  // Pagination states
  const [givenPage, setGivenPage] = useState(1);
  const [receivedPage, setReceivedPage] = useState(1);
  const [recognitionsPage, setRecognitionsPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);

  const pageSize = 5;

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current user
      const userRes = await getCurrentUser();
      if (userRes?.data?.requestSuccessful) {
        setCurrentUser(userRes.data.responseData);
      }

      // Fetch user points
      const pointsRes = await getUserPoints();
      if (pointsRes?.data?.requestSuccessful) {
        setUserPoints(pointsRes.data.responseData);
      }

      // Fetch total approved points
      const approvedPointsRes = await getTotalApprovedAwardPointsMe();
      if (approvedPointsRes?.responseData !== undefined) {
        setTotalApprovedPoints(approvedPointsRes.responseData);
      }

      // Fetch given appreciations
      const givenRes = await getGivenAppreciations("", 1, pageSize);
      setGivenAppreciations(givenRes.responseData || []);

      // Fetch received appreciations
      const receivedRes = await getReceivedAppreciations("", 1, pageSize);
      setReceivedAppreciations(receivedRes.responseData || []);

      // Fetch recognitions
      const recognitionsRes = await getCurrentUserRecognitions("", 1, pageSize);
      setRecognitions(recognitionsRes.responseData || []);

      // Fetch transactions
      const transactionsRes = await getMyTransactions("", 1, pageSize);
      setTransactions(transactionsRes.responseData || []);

    } catch (err: any) {
      setError(err.message || "Failed to load profile data");
      console.error("useProfileData Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const loadMoreGiven = async () => {
    try {
      const nextPage = givenPage + 1;
      const res = await getGivenAppreciations("", nextPage, pageSize);
      setGivenAppreciations((prev) => [...prev, ...(res.responseData || [])]);
      setGivenPage(nextPage);
    } catch (err) {
      console.error("Load more given error:", err);
    }
  };

  const loadMoreReceived = async () => {
    try {
      const nextPage = receivedPage + 1;
      const res = await getReceivedAppreciations("", nextPage, pageSize);
      setReceivedAppreciations((prev) => [...prev, ...(res.responseData || [])]);
      setReceivedPage(nextPage);
    } catch (err) {
      console.error("Load more received error:", err);
    }
  };

  const loadMoreRecognitions = async () => {
    try {
      const nextPage = recognitionsPage + 1;
      const res = await getCurrentUserRecognitions("", nextPage, pageSize);
      setRecognitions((prev) => [...prev, ...(res.responseData || [])]);
      setRecognitionsPage(nextPage);
    } catch (err) {
      console.error("Load more recognitions error:", err);
    }
  };

  const loadMoreTransactions = async () => {
    try {
      const nextPage = transactionsPage + 1;
      const res = await getMyTransactions("", nextPage, pageSize);
      setTransactions((prev) => [...prev, ...(res.responseData || [])]);
      setTransactionsPage(nextPage);
    } catch (err) {
      console.error("Load more transactions error:", err);
    }
  };

  const updateUserProfile = async (data: UpdateProfileVm) => {
    try {
      await updateProfile(data);
      // Refetch user data
      const userRes = await getCurrentUser();
      if (userRes?.data?.requestSuccessful) {
        setCurrentUser(userRes.data.responseData);
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to update profile");
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      await uploadImage(file);
      // Refetch user data
      const userRes = await getCurrentUser();
      if (userRes?.data?.requestSuccessful) {
        setCurrentUser(userRes.data.responseData);
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to upload profile picture");
    }
  };

  const refetch = async () => {
    await fetchAllData();
  };

  return {
    currentUser,
    userPoints,
    totalApprovedPoints,
    givenAppreciations,
    receivedAppreciations,
    recognitions,
    transactions,
    loading,
    error,
    updateUserProfile,
    uploadProfilePicture,
    loadMoreGiven,
    loadMoreReceived,
    loadMoreRecognitions,
    loadMoreTransactions,
    refetch,
  };
};