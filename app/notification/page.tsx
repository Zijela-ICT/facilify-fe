"use client";

import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import Pagination from "@/components/pagination-table";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import moment from "moment";
import { JSX, useEffect, useState } from "react";

interface Notification {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

function NotificationPage() {
  const axiosInstance = createAxiosInstance();
  const {
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    clearSearchAndPagination,
    centralState,
    setCentralState,
    notificationState,
    setNotificationState,
    companyStateId,
  } = useDataPermission();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notification, setANotification] = useState<Notification>(null);
  const [activeRowId, setActiveRowId] = useState<number | null>(null);

  const [notificationFilter, setNotificationFilter] = useState("all");

  useEffect(() => {
    setPagination({
      ...pagination,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    });
  }, []);

  const getNotifications = async () => {
    const endpoint = notificationFilter === "unread" ? "all/unread" : "all";
    const response = await axiosInstance.get(
      `/notifications/my-notifications/${endpoint}?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setNotifications(response.data?.data || []);

    const extra = response.data.extra;
    if (extra) {
      setPagination({
        currentPage: extra.page,
        pageSize: extra.pageSize,
        total: extra.total,
        totalPages: extra.totalPages,
      });
    }
  };

  const getNotificationsUnread = async () => {
    const response = await axiosInstance.get(
      `/notifications/my-notifications/all/unread`
    );
    const notifications = response.data?.data;
    setNotificationState(notifications?.length || 0);
  };

  const getANotif = async () => {
    const response = await axiosInstance.get(`/notifications/${activeRowId}`);
    setANotification(response.data.data || {});
  };

  useEffect(() => {
    getNotifications();
  }, [
    centralState,
    pagination.currentPage,
    searchQuery,
    filterQuery,
    notificationFilter,
    companyStateId,
  ]);

  useEffect(() => {
    if (centralState === "viewNotif") {
      getANotif();
    }
    getNotificationsUnread();
  }, [centralState]);

  const handleNext = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination({ ...pagination, currentPage: pagination.currentPage + 1 });
    }
  };

  const handlePrevious = () => {
    if (pagination.currentPage > 1) {
      setPagination({ ...pagination, currentPage: pagination.currentPage - 1 });
    }
  };

  const handlePageClick = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const groupedNotifications =
    notifications?.length > 0
      ? notifications.reduce<Record<string, Notification[]>>(
          (acc, notification) => {
            const dateKey = moment(notification.createdAt).format(
              "Do MMM YYYY"
            );
            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }
            acc[dateKey].push(notification);
            return acc;
          },
          {}
        )
      : {};

  const sortedDates = Object.keys(groupedNotifications || {}).sort(
    (a, b) =>
      moment(b, "Do MMM YYYY").valueOf() - moment(a, "Do MMM YYYY").valueOf()
  );

  const componentMap: Record<string, JSX.Element> = {
    viewNotif: (
      <div className="bg-white rounded-lg p-2 pb-8 transition m-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">
            {notification?.content}
          </div>
        </div>
        <div className="mt-2 text-sm text-green-700">
          <span className="font-medium">Read at: </span>
          {notification
            ? moment.utc(notification.updatedAt).format("llll")
            : ""}
        </div>
      </div>
    ),
  };

  return (
    <DashboardLayout
      title="Notifications"
      detail="All Notifications"
      getTitle={() => "Notification"}
      getDetail={() => "Read notiication"}
      componentMap={componentMap}
      setActiveRowId={setActiveRowId}
      setANotification = {setANotification}
    >
      <div className="relative bg-white rounded-2xl p-8">
        <div className="mb-4">
          <label htmlFor="notificationFilter" className="mr-2">
            Show:
          </label>
          <select
            id="notificationFilter"
            value={notificationFilter}
            onChange={(e) => {
              setNotificationFilter(e.target.value);
              // Reset to page 1 when filter changes
              setPagination({ ...pagination, currentPage: 1 });
            }}
            className="border rounded p-1"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>
        </div>
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <div key={date} className="mb-6 mt-8">
              <h3 className="text-md font-semibold mb-2">{date}</h3>
              <ul>
                {groupedNotifications[date]?.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-center border-b py-2 cursor-pointer"
                    onClick={() => {
                      setCentralState("viewNotif");
                      setActiveRowId(notification.id);
                    }}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 transition-colors duration-300 ${
                        notification.isRead ? "bg-green-500" : "bg-blue-500"
                      }`}
                    ></span>
                    <div>
                      <div className="text-sm font-medium">
                        {notification.content}
                      </div>
                      <div className="text-xs text-gray-500">
                        {moment.utc(notification.createdAt).format("ll")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 m-8">No notifications</p>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          handlePageClick={handlePageClick}
        />
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(NotificationPage, ["notifications"]);
