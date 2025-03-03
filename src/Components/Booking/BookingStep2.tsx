import { Calendar } from 'primereact/calendar';
import { FormEvent, Nullable } from 'primereact/ts-helpers';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { emailRegex, formatDateToISO, removeEmptyValues, showErrorToast, showSuccessToast } from '../../Utils/commonLogic';
import { Lane } from '../../Pages/Booking/BookingData';
import { Dropdown, DropdownChangeEvent, DropdownProps } from 'primereact/dropdown';
import { timeList, TimeList } from '../../Utils/SiteData';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import TextInput from '../TextInput';
import { Checkbox } from 'primereact/checkbox';
import PhoneNumberInput from '../PhoneNumberInput';
import apiRequest from '../../Utils/apiRequest';
import { Toast } from 'primereact/toast';


type BookingType = "Online" | "Offline";

interface BookingFormData {
  email: string;
  fromTime: string;
  toTime: string;
  bookingTitle?: string;
  // bookingDetails?: string;
  firstName: string;
  lastName: string;
  telephoneNumber?: string;
  organization?: string;
  selectedLanesDtos: string[];
  bookingDatesDtos: string[];
  bookingType: BookingType;
}


const BookingStep2 = forwardRef(({ isValidNumber, setIsValidNumber, timeListData, setTimeListData, bookingPrice, setBookingPrice, isRequired, setIsRequired, bookingLanes, setBookingLanes, lanesListData, setLanesListData, bookingDates, setBookingDates, bookingFormData, setBookingFormData, isOpen, toastRef, setLoading, fetchBookings, onSuccessFnCall, isAgree, setShowTermsConditionModal, setShowPrivacyPolicyModal, enableEditInterface = false, selectedBookingLanes, setSelectedBookingLanes }: {
  isValidNumber: boolean, setIsValidNumber: React.Dispatch<React.SetStateAction<boolean>>, timeListData: TimeList[], setTimeListData: React.Dispatch<React.SetStateAction<TimeList[]>>, bookingPrice: number, setBookingPrice: React.Dispatch<React.SetStateAction<number>>, isRequired: boolean, setIsRequired: React.Dispatch<React.SetStateAction<boolean>>, bookingLanes: Lane[], setBookingLanes: React.Dispatch<React.SetStateAction<Lane[]>>, lanesListData: Lane[], setLanesListData: React.Dispatch<React.SetStateAction<Lane[]>>, bookingDates: Nullable<Date[]>, setBookingDates: React.Dispatch<React.SetStateAction<Nullable<Date[]>>>, bookingFormData: BookingFormData, setBookingFormData: React.Dispatch<React.SetStateAction<BookingFormData>>, isOpen: boolean, toastRef: React.RefObject<Toast>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, fetchBookings: () => Promise<void>, onSuccessFnCall: (response: any) => Promise<void>, isAgree?: {
    terms: boolean;
    privacy: boolean;
  }, setShowTermsConditionModal?: React.Dispatch<React.SetStateAction<boolean>>, setShowPrivacyPolicyModal?: React.Dispatch<React.SetStateAction<boolean>>, enableEditInterface?: boolean, selectedBookingLanes?: Lane[], setSelectedBookingLanes?: React.Dispatch<React.SetStateAction<Lane[]>>
}, ref) => {
  const [laneError, setLaneError] = useState<boolean>(false);
  const [alreadySelectedLaneList, setAlreadySelectedLaneList] = useState<Lane[]>([]);

  const handleDateChange = (e: FormEvent<Date[], React.SyntheticEvent<Element, Event>>) => {
    if (e && e?.value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let selectedDates = e.value.map(date => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      });

      const isTodaySelected = selectedDates.some(date => date.getTime() === today.getTime());

      // If today is selected, only today should be set; otherwise, remove today from the selection
      let finalDates: Date[];
      if (isTodaySelected) {
        finalDates = [today];
      } else {
        finalDates = selectedDates.filter(date => date.getTime() !== today.getTime());
      }

      // Format the dates correctly for form submission
      const formattedDates = finalDates.map(date =>
        formatDateToISO(date)
      );

      setLanesListData([]);
      setBookingLanes([]);
      setBookingFormData({
        ...bookingFormData,
        selectedLanesDtos: selectedBookingLanes && selectedBookingLanes.length > 0 ? [...selectedBookingLanes?.map((v: any) => String(v?.id)).filter(Boolean)] : [],
        bookingDatesDtos: formattedDates
      });
      setBookingDates(finalDates);
    }
  };


  const handleClearBookingDates = () => {
    setBookingDates([]);
    setBookingFormData({ ...bookingFormData, bookingDatesDtos: [], selectedLanesDtos: selectedBookingLanes && selectedBookingLanes.length > 0 ? [...selectedBookingLanes?.map((v: any) => String(v?.id)).filter(Boolean)] : [], });
    setLanesListData([]);
    setBookingLanes([]);
  }

  const selectedStartTimeTemplate = (data: TimeList, props: DropdownProps) => {
    if (data) {
      return (
        <div className="d-flex align-items-center">
          <div>From - {data.label}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  // Function to filter valid end times based on selected start time
  const getValidEndTimes = (startTime?: string) => {
    if (!startTime) return [];

    const startIndex = timeList.findIndex((time) => time.value === startTime);
    if (startIndex === -1) return [];

    // Ensure the end times maintain the same minute part (e.g., :30 stays :30)
    return timeList.filter((_, index) => index > startIndex && (index - startIndex) % 2 === 0);
  };

  const endTimeOptions = getValidEndTimes(bookingFormData.fromTime);

  const handleViewTermsCondition = () => {
    setShowTermsConditionModal && setShowTermsConditionModal(true);
  }

  const selectedEndTimeTemplate = (data: TimeList, props: DropdownProps) => {
    if (data) {
      return (
        <div className="d-flex align-items-center">
          <div>To - {data.label}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const handleViewPrivacyPolicy = () => {
    setShowPrivacyPolicyModal && setShowPrivacyPolicyModal(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingFormData({
      ...bookingFormData,
      [name]: value
    });
  }

  const confirmBooking = async () => {
    setLoading(true);
    const response: any = await apiRequest({
      method: "post",
      url: "/booking",
      data: removeEmptyValues({ ...bookingFormData, telephoneNumber: bookingFormData.telephoneNumber ? `+${bookingFormData.telephoneNumber}` : "" }),
    });

    console.log(response);
    if (response?.bookingId && !response?.error) {
      showSuccessToast(toastRef, "Booking Pending Payment", "Your booking has been successfully created! Please complete the payment to confirm your reservation.");
      onSuccessFnCall(response);
    } else {
      setLoading(false);
      // showErrorToast(toastRef, " Booking Failed", "We couldn’t process your booking due to a technical issue. Please try again later or contact support if the issue persists.");
      showErrorToast(toastRef, " Booking Failed", response?.error);
    }
    fetchBookings();
  };

  const handleConfirmBooking = async () => {
    setIsRequired(true);

    const {
      email,
      bookingDatesDtos,
      fromTime,
      toTime,
      selectedLanesDtos,
      firstName,
      lastName,
      telephoneNumber
    } = bookingFormData || {};

    const isAgreeValid = isAgree ? isAgree.terms && isAgree.privacy : true;

    if (
      !email ||
      !bookingDatesDtos?.length ||
      !fromTime ||
      !toTime ||
      !selectedLanesDtos?.length ||
      !isAgreeValid ||
      !firstName ||
      !lastName ||
      !telephoneNumber ||
      !isValidNumber
    ) {
      return;
    }

    confirmBooking();
  };


  useImperativeHandle(ref, () => ({
    handleConfirmBooking,
  }));

  const fetchLanes = async () => {
    setLaneError(false);
    setLanesListData([]);

    const response = await apiRequest({
      method: "get",
      url: "/booking/check-availability",
      params: {
        fromTime: bookingFormData?.fromTime,
        toTime: bookingFormData?.toTime,
        date: bookingFormData?.bookingDatesDtos?.join(',')
      }
    });

    console.log(response);

    setLanesListData(Array.isArray(response) ? response.map((laneObj: any) => ({
      id: laneObj?.laneId || 0,
      name: laneObj?.laneName || ""
    })) : []);
    setLaneError(true);
    fetchBookings();
  };

  const fetchBookingAmount = async () => {
    const reqParams = {
      laneIds: bookingFormData?.selectedLanesDtos?.join(","),
      noOfDates: bookingFormData?.bookingDatesDtos?.length,
      fromTime: bookingFormData?.fromTime,
      toTime: bookingFormData?.toTime
    };
    setBookingPrice(0);
    const response = await apiRequest({
      method: "get",
      url: "/booking",
      params: reqParams
    });

    console.log(response);
    setBookingPrice(response && response?.bookingPrice ? Number(response.bookingPrice) : 0);
  }

  useEffect(() => {
    if (isOpen) {
      setTimeListData(timeList);
    }
  }, [isOpen]);

  useEffect(() => {
    if (bookingFormData?.bookingDatesDtos && bookingFormData?.bookingDatesDtos?.length > 0 && bookingFormData?.fromTime && bookingFormData?.toTime) fetchLanes();
  }, [bookingFormData?.bookingDatesDtos, bookingFormData?.fromTime, bookingFormData?.toTime]);

  useEffect(() => {
    if (bookingFormData?.selectedLanesDtos && bookingFormData?.selectedLanesDtos?.length > 0 && bookingFormData?.bookingDatesDtos && bookingFormData?.bookingDatesDtos?.length > 0 && bookingFormData?.fromTime && bookingFormData?.toTime) fetchBookingAmount();
  }, [bookingFormData?.selectedLanesDtos, bookingFormData?.bookingDatesDtos, bookingFormData?.fromTime, bookingFormData?.toTime]);

  useEffect(() => { if (enableEditInterface && selectedBookingLanes) setAlreadySelectedLaneList(selectedBookingLanes) }, [enableEditInterface]);

  console.log(bookingFormData, "fgdvsfgbh");

  return (
    <div className="booking_form_area">
      <h5 className="form_title">Booking details</h5>

      <div className="row">
        {/* Date */}
        <div className="col-12">
          <div className="page_form_group">
            <label htmlFor='bookingDate' className={`custom_form_label is_required`}>Date</label>
            <div className="multi_date_input_group">
              <Calendar
                inputId="bookingDate"
                value={bookingDates}
                onChange={handleDateChange}
                selectionMode="multiple"
                readOnlyInput
                placeholder="Select date(s)"
                className="multi_date_input_area w-100"
                inputClassName="multi_date_input"
                minDate={new Date()}
              // minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
              />
              {bookingDates && bookingDates?.length > 0 && (
                <i className="bi bi-x-lg data_clear_icon" onClick={handleClearBookingDates}></i>
              )}
            </div>
            {(isRequired && bookingFormData?.bookingDatesDtos?.length === 0) && (
              <small className="form_error_msg">Atleast single date needed for booking!</small>
            )}
          </div>
        </div>

        {/* Time */}
        <div className="col-12">
          <div className="page_form_group">
            <label htmlFor='bookingTime' className={`custom_form_label is_required`}>Time</label>

            <div className="row">
              {/* Start time */}
              <div className="col-12 col-sm-6">
                <Dropdown
                  id="startTime"
                  value={bookingFormData?.fromTime || undefined}
                  onChange={(e: DropdownChangeEvent) => {
                    setLanesListData([]);
                    setBookingLanes([]);
                    setBookingPrice(0);

                    setBookingFormData((prev: BookingFormData) => ({
                      ...prev,
                      fromTime: e?.value || "",
                      toTime: "",
                      selectedLanesDtos: selectedBookingLanes && selectedBookingLanes.length > 0 ? [...selectedBookingLanes?.map((v: any) => String(v?.id)).filter(Boolean)] : [],
                    }));
                  }}
                  options={timeListData}
                  optionLabel="label"
                  valueTemplate={selectedStartTimeTemplate}
                  placeholder="Start time"
                  className="form_dropdown w-100 mb-3 mb-sm-0"
                  showClear
                />
              </div>

              {/* End time */}
              <div className="col-12 col-sm-6">
                <Dropdown
                  id="endTime"
                  value={bookingFormData?.toTime || undefined}
                  onChange={(e: DropdownChangeEvent) => {
                    setLanesListData([]);
                    setBookingLanes([]);
                    setBookingPrice(0);

                    setBookingFormData((prev: BookingFormData) => ({
                      ...prev,
                      toTime: e?.value || "",
                      selectedLanesDtos: selectedBookingLanes && selectedBookingLanes.length > 0 ? [...selectedBookingLanes?.map((v: any) => String(v?.id)).filter(Boolean)] : [],
                    }));
                  }}
                  options={endTimeOptions}
                  optionLabel="label"
                  valueTemplate={selectedEndTimeTemplate}
                  placeholder="End time"
                  className="form_dropdown w-100"
                  showClear
                  disabled={!bookingFormData?.fromTime}
                />
              </div>
            </div>
          </div>
        </div>
        {(isRequired && (!bookingFormData?.fromTime || !bookingFormData?.fromTime)) && (
          <small className="form_error_msg">Booking time range required!</small>
        )}
        {/* <div className="col-12">
                                        <div className="message_label danger mb-4">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            Your booking doesn't meet the advance-notice requirements. Bookings are not allowed to be made less than 1 hour in advance.
                                        </div>
                                    </div> */}



        {/* Lanes */}
        {enableEditInterface && <div className="col-12">
          <div className="page_form_group">
            <label htmlFor='bookingLanes' className={`custom_form_label`}>Already Selected Spaces</label>
            <MultiSelect
              value={selectedBookingLanes}
              onChange={(e: MultiSelectChangeEvent) => {
                setBookingPrice(0);
                setSelectedBookingLanes && setSelectedBookingLanes(e.value);
                setBookingFormData({
                  ...bookingFormData,
                  selectedLanesDtos: [
                    ...e.value.map((v: any) => String(v?.id)).filter(Boolean),
                    ...(bookingLanes?.length > 0 ? bookingLanes.map((v: any) => String(v?.id)).filter(Boolean) : [])
                  ],
                });
              }}
              options={alreadySelectedLaneList}
              display="chip"
              optionLabel="name"
              showClear
              filter
              filterPlaceholder="Search lanes"
              placeholder="Select space"
              // maxSelectedLabels={4}
              className="w-100"
              emptyMessage="No spaces found!"
            // disabled={lanesListData?.length === 0}
            />
          </div>
        </div>}

        <div className="col-12">
          <div className="page_form_group">
            <label htmlFor='bookingLanes' className={`custom_form_label ${enableEditInterface ? "" : "is_required"}`}>{enableEditInterface ? "Newly Added Spaces" : "Spaces"}</label>
            <MultiSelect
              value={bookingLanes}
              onChange={(e: MultiSelectChangeEvent) => {
                setBookingPrice(0);
                setBookingLanes(e.value);
                setBookingFormData({
                  ...bookingFormData,
                  selectedLanesDtos: [
                    ...e.value.map((v: any) => String(v?.id)).filter(Boolean),
                    ...(selectedBookingLanes && selectedBookingLanes?.length > 0 ? selectedBookingLanes.map((v: any) => String(v?.id)).filter(Boolean) : [])
                  ],
                });
              }}
              options={lanesListData}
              display="chip"
              optionLabel="name"
              showClear
              filter
              filterPlaceholder="Search lanes"
              placeholder="Select space"
              // maxSelectedLabels={lanesListData?.length}
              className="w-100"
              emptyMessage="No spaces found!"
              disabled={lanesListData?.length === 0}
            />

            {(laneError && lanesListData?.length === 0 && bookingFormData?.bookingDatesDtos?.length > 0 && bookingFormData?.fromTime && bookingFormData?.toTime) && (
              <small className="form_error_msg">No lanes available for your date and time!</small>
            )}

            {(isRequired && bookingFormData?.selectedLanesDtos?.length === 0) && (
              <small className="form_error_msg">Please select available lanes for booking!</small>
            )}
          </div>
        </div>

        {/* Booking title */}
        <div className="col-12">
          <TextInput
            id="bookingTitle"
            label="Booking title"
            labelHtmlFor="bookingTitle"
            required={false}
            inputType="text"
            value={bookingFormData?.bookingTitle}
            placeholder="Enter a title for this booking"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setBookingFormData({ ...bookingFormData, bookingTitle: e.target.value }) }}
            error={''}
            formGroupClassName="mb-0"
          />
        </div>

        {/* Terms and conditions agreement */}
        {isAgree && <div className="col-12">
          <div className="page_form_group mb-0">
            <div className="form_check_area">
              <Checkbox
                inputId="isAgree"
                name="isAgree"
                value={isAgree?.privacy && isAgree?.terms}
                className="form_checkbox"
                checked={isAgree?.privacy && isAgree?.terms}
              />
              <label htmlFor="isAgree" className="form_check_label is_required">I agree with <b>Kover Drive</b>' s&nbsp;
                <button onClick={handleViewTermsCondition}>Terms and Conditions</button>&nbsp;&&nbsp;
                <button onClick={handleViewPrivacyPolicy}>Privacy Policy</button>
              </label>
            </div>

            <p className="note_text">
              <i className="bi bi-info-circle me-1"></i>
              Please click on <b>'Terms and Conditions'</b> and <b>'Privacy Policy'</b> and read them clearly, accept them by clicking on the 'Ok' button and proceed with your booking.
            </p>

            {/* <div className="form_check_area pt-2">
                                                <Checkbox
                                                    inputId="isAgreePrivacy"
                                                    name="isAgreePrivacy"
                                                    value={isAgreePrivacy}
                                                    className="form_checkbox"
                                                    onChange={e => setIsAgreePrivacy(e.checked ?? false)}
                                                    checked={isAgreePrivacy}
                                                />
                                                <label htmlFor="isAgreePrivacy" className="form_check_label is_required">I agree with <b>Kover Drive</b>' s&nbsp;
                                                    <button onClick={handleViewPrivacyPolicy}>Privacy Policy</button>
                                                </label>
                                            </div> */}
          </div>
        </div>}

        {/* Booking description */}
        {/* <div className="col-12">
                                        <TextArea
                                            id="bookingDescription"
                                            label="Booking description"
                                            labelHtmlFor="bookingDescription"
                                            required={false}
                                            value={bookingFormData?.bookingDetails}
                                            placeholder="Enter a description for your booking"
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { setBookingFormData({ ...bookingFormData, bookingDetails: e.target.value }) }}
                                            error={''}
                                            formGroupClassName="mb-0"
                                        />
                                    </div> */}
      </div>

      <hr className="form_divider" />

      <h5 className="form_title">{isAgree ? `Your details (${bookingFormData?.email})` : "Customer details"}</h5>

      <div className="row">
        {/* First name */}
        <div className="col-12 col-sm-6">
          <TextInput
            id="firstName"
            label="First name"
            labelHtmlFor="firstName"
            required={true}
            inputType="text"
            value={bookingFormData?.firstName}
            name="firstName"
            placeholder="eg: John"
            onChange={handleChange}
            error={(isRequired && !bookingFormData?.firstName) ? "First name is required!" : ""}
          />
        </div>

        {/* Last name */}
        <div className="col-12 col-sm-6">
          <TextInput
            id="lastName"
            label="Last name"
            name="lastName"
            labelHtmlFor="lastName"
            required={true}
            inputType="text"
            value={bookingFormData?.lastName}
            placeholder="eg: Doe"
            onChange={handleChange}
            error={(isRequired && !bookingFormData?.lastName) ? "Last name is required!" : ""}
          />
        </div>

        {/* Phone number */}
        <div className="col-12 col-sm-6">
          {/* <TextInput
                                            id="phoneNumber"
                                            label="Phone number"
                                            labelHtmlFor="phoneNumber"
                                            required={false}
                                            inputType="number"
                                            value={phoneNumber}
                                            placeholder="eg: 077 123 4567"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                                            error={phoneNumberError}
                                            formGroupClassName="mb-sm-0"
                                        /> */}
          <PhoneNumberInput
            id="phoneNumber"
            label="Phone number"
            labelHtmlFor="phoneNumber"
            required={true}
            name="telephoneNumber"
            value={bookingFormData?.telephoneNumber}
            onChange={(value: string) => { setBookingFormData({ ...bookingFormData, telephoneNumber: value }) }}
            error={(isRequired && !bookingFormData?.telephoneNumber) ? "Phone number is required!" : ""}
            formGroupClassName="mb-sm-0"
            setIsValidNumber={setIsValidNumber}
          />
        </div>

        {/* Email */}
        {!isAgree && <div className="col-12 col-sm-6">
          <TextInput
            id="bookingEmail"
            name="email"
            label="Email"
            labelHtmlFor="bookingEmail"
            required={true}
            inputType="email"
            keyFilter={'email'}
            value={bookingFormData?.email}
            placeholder="Your email address"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
            error={(isRequired && bookingFormData?.email === "") ? "Email is required!" : (!emailRegex.test(bookingFormData?.email) && bookingFormData?.email) ? "Please enter valid email!" : ""}
            inputAutoFocus={true}
          />
        </div>}

        {/* Organization */}
        <div className="col-12 col-sm-6">
          <TextInput
            id="organization"
            label="Organization"
            labelHtmlFor="organization"
            required={false}
            inputType="text"
            value={bookingFormData?.organization}
            placeholder="Optional"
            onChange={handleChange}
            error={''}
            formGroupClassName="mb-0"
            name="organization"
          />
        </div>
      </div>
      {bookingFormData?.selectedLanesDtos?.length > 0 && <>
        <hr className="form_divider" />

        <h5 className="form_title">{isAgree ? "Payment and Facility Disclaimer" : "Payment"}</h5>
        <div className="row">
          <div className="col-12">
            <div className="price_info_area">
              <label htmlFor='bookingPrice' className={`custom_form_label`}>Booking price</label>
              <h3 className="price_text">
                {bookingPrice === 0 ? "Calculating..." : `$ ${bookingPrice.toFixed(2)}`}
              </h3>

              {bookingPrice && bookingPrice !== 0 && <span className="form_info">
                (Tax included.)
              </span>}
              {isAgree && <>
                <hr />
                <label htmlFor='bookingCancellation' className={`custom_form_label`}>Facility Disclaimer</label>
                <p className="form_info mt-2">
                  By using this facility, you acknowledge and agree to the following terms:
                </p>
                <p className="form_info mt-3">
                  <span>1. </span>Assumption of Risk: Participation in cricket activities is at your own risk. We are not responsible for any injury, accident, or harm that may occur while using the facility.
                </p>
                <p className="form_info mt-3">
                  <span>2. </span>Property Damage: Any damage to the facility, equipment, or property caused by you or your group will be your sole responsibility. You agree to cover the costs for repairs or replacements.
                </p>
              </>}
            </div>
          </div>
        </div>
      </>}
    </div>
  )
})

export default BookingStep2
