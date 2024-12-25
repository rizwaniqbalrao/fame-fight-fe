import React, { useEffect, useState } from "react";
import Searching from "../../extra/Searching";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useSelector } from "react-redux";
import {
  getVerificationRequest,
  verificationRequestAccept,
  verificationRequestDecline,
} from "../../store/verificationRequestSlice";
import dayjs from "dayjs";
import Button from "../../extra/Button";
import TrueArrow from "../../assets/icons/TrueArrow.svg";
import Close from "../../assets/icons/close.svg";
import { Box, Modal, Typography } from "@mui/material";
import { RootStore, useAppDispatch } from "@/store/store";
import Image from "next/image";
import { baseURL } from "@/util/config";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";

import { withdrawRequestAccept } from "@/store/withdrawRequestSlice";

const style: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  backgroundColor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: "24px",
  padding: "19px",
};

interface ErrorState {
  reason: string;
}

const PendingVerificationRequest = () => {
  const { pendingData, totalPendingData } = useSelector(
    (state: RootStore) => state.verificationRequest
  );


  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [reasonData, setReasonData] = useState("");
  const [size, setSize] = useState<number>(20);
  const [openReason, setOpenReason] = useState(false);
  const [search, setSearch] = useState<string>();
  const [declinedId, setDeclinedId] = useState<string>();
  const [isAccept, setIsAccept] = useState(false);
  const [acceptId, setAcceptId] = useState<any>();
  const [error, setError] = useState<ErrorState>({
    reason: "",
  });
  useClearSessionStorageOnPopState("multiButton");

  useEffect(() => {
    let payload: any = {
      start: page,
      limit: size,
      type: "pending",
    };
    dispatch(getVerificationRequest(payload));
  }, [page, size]);

  useEffect(() => {
    setData(pendingData);
  }, [pendingData]);

  const postReportTable = [
    {
      Header: "No",
      body: "no",
      Cell: ({ index }: { index: number }) => (
        <span className="  text-nowrap">{(page - 1) * size + index + 1}</span>
      ),
    },

    {
      Header: "User",
      body: "userName",
      Cell: ({ row }: { row: any }) => (
        <>
          <img
            src={baseURL + row?.userId?.image}
            width="60px"
            height="60px"
            style={{ objectFit: "cover", marginRight: "10px" }}
          />
          <span className="text-capitalize">{row?.userId?.name}</span>
        </>
      ),
    },

    {
      Header: "Profile Selfie",
      body: "profileSelfie",
      Cell: ({ row, index }: { row: any; index: number }) => (
        <img
          src={baseURL + row?.profileSelfie}
          width="60px"
          height="60px"
          style={{ objectFit: "cover" }}
        />
      ),
    },

    {
      Header: "Document",
      body: "document",
      Cell: ({ row, index }: { row: any; index: number }) => (
        <img
          src={baseURL + row?.document}
          width="60px"
          height="60px"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      Header: "Document Type",
      body: "documentType",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.nameOnDocument}</span>
      ),
    },

    {
      Header: "Date",
      body: "date",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          {row?.date ? dayjs(row?.date).format("DD MMMM YYYY") : ""}
        </span>
      ),
    },
    {
      Header: "Action",
      body: "action",
      Cell: ({ row }: { row: any }) => (
        <div className="action-button">
          {row.status === 2 ? (
            ""
          ) : (
            <Button
              btnIcon={
                <Image src={TrueArrow} alt="TrueArrow" width={25} height={25} />
              }
              onClick={() => handleEdit(row?._id, "pay")}
            />
          )}
          <Button
            btnIcon={
              <Image src={Close} alt="TrueArrow" width={25} height={25} />
            }
            onClick={() => handleDecline(row?._id)}
          />
        </div>
      ),
    },
  ];

  const handleFilterData = (filteredData: any) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleSolved = (id: any) => {
    console.log("acceptId", acceptId);

    dispatch(verificationRequestAccept(acceptId));
    handleIsAccept();
  };

  const handleDecline = (id: any) => {
    setOpenReason(true);
    setDeclinedId(id);
  };

  const handleCloseReason = () => {
    setOpenReason(false);
  };

  const handleSubmit = () => {


    if (!reasonData) {
      let error = {} as ErrorState;
      if (!reasonData) error.reason = "Reason is required";
      return setError({ ...error });
    } else {
      const reason = {
        reason: reasonData,
      };
      const payload: any = {
        verificationRequestId: declinedId,
        data: reason,
        type: "pending",
      };
      dispatch(verificationRequestDecline(payload));
      handleCloseReason();
    }
  };

  const handleEdit = (id: any, type: any) => {;
    setIsAccept(true);
    setAcceptId(id);
  };

  const handleIsAccept = () => {
    setIsAccept(false);
  };

  return (
    <>
      <div className="userPage p-0">
        <div className="payment-setting-box user-table ">
          <div style={{ padding: "12px", position: "relative" }}>
            <h5
              style={{
                fontWeight: "500",
                fontSize: "20px",
                marginBottom: "5px",
                marginTop: "5px",
                padding: "3px",
              }}
            >
              Pending Verification Request Table
            </h5>
            <Searching
              placeholder={"Search..."}
              data={pendingData}
              label={"Search for ID, Keyword, Username,Name,Title,Reported "}
              type={"client"}
              setData={setData}
              onFilterData={handleFilterData}
              searchValue={search}
              actionShow={false}
            />
          </div>
          <div className="mt-3">
            <Table
              data={data}
              mapData={postReportTable}
              serverPerPage={size}
              serverPage={page}
              type={"server"}
            />
            <div className="mt-3">
              <Pagination
                type={"server"}
                activePage={page}
                rowsPerPage={size}
                userTotal={totalPendingData}
                setPage={setPage}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* For a Decline Withdraw request :-  */}
      <Modal
        open={openReason}
        onClose={handleCloseReason}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Reason
          </Typography>
          <form style={{ padding: "15px", paddingTop: "0px" }}>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <div className="col-12 mt-2">
                <div className="col-12 mt-3 text-about">
                  <label className="label-form">Reason</label>
                  <textarea
                    cols={6}
                    rows={6}
                    value={reasonData}
                    placeholder="Enter reason..."
                    onChange={(e) => {
                      setReasonData(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          reason: `Reason Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          reason: "",
                        });
                      }
                    }}
                  ></textarea>
                  {error.reason && (
                    <p className="errorMessage">
                      {error.reason && error.reason}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-end">
                <Button
                  onClick={handleCloseReason}
                  btnName={"Close"}
                  newClass={"close-model-btn"}
                />
                <Button
                  onClick={handleSubmit}
                  btnName={"Submit"}
                  type={"button"}
                  newClass={"submit-btn"}
                  style={{
                    borderRadius: "0.5rem",
                    width: "88px",
                    marginLeft: "10px",
                  }}
                />
              </div>
            </div>
          </form>
        </Box>
      </Modal>

      {/* For a accepted a Verification request :-  */}

      <Modal
        open={isAccept}
        onClose={handleIsAccept}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Would you like to accept a verification request?
          </Typography>

          <div className="mt-3 d-flex justify-content-end">
            <Button
              onClick={handleIsAccept}
              btnName={"Close"}
              newClass={"close-model-btn"}
            />
            <Button
              onClick={handleSolved}
              btnName={"Submit"}
              type={"button"}
              newClass={"submit-btn"}
              style={{
                borderRadius: "0.5rem",
                width: "88px",
                marginLeft: "10px",
              }}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default PendingVerificationRequest;
