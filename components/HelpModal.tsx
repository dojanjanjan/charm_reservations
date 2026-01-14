import React from 'react';
import { X } from './Icons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white flex-shrink-0">
          <h3 className="text-xl font-bold text-[var(--color-primary)]">Help & Instructions</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-8">
          <section className="space-y-4">
            <h4 className="text-lg font-bold border-b pb-2 text-[var(--color-primary)]">English Instructions</h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-bold text-gray-800">Creating a Reservation</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>Click on any empty time slot in the calendar or timeline view</li>
                  <li>Fill in guest name, number of people, and contact phone</li>
                  <li>Select the table area (Indoor or Outdoor) and specific table</li>
                  <li>Add any special notes if needed</li>
                  <li>Click "Create Reservation" to confirm</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">Editing a Reservation</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>Click on any existing reservation</li>
                  <li>Modify the details as needed</li>
                  <li>Click "Update Reservation" to save changes</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">Canceling a Reservation</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>Click on the reservation you want to cancel</li>
                  <li>Click the "Cancel Reservation" button</li>
                  <li>Confirm the cancellation</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">View Options</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>Calendar: See all reservations organized by date</li>
                  <li>Timeline: View reservations in a time-based grid</li>
                  <li>List: Browse all reservations in a simple list format</li>
                  <li>7 Days: View all reservations for the next week grouped by date</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">Calendar Indicators</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>Green dot: 1-2 reservations</li>
                  <li>Amber dot: 3-5 reservations</li>
                  <li>Red dot: 6+ reservations (busy day)</li>
                  <li>Orange dot: At least one reservation with unassigned table</li>
                  <li>Blue indicator (top right): German public holiday</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">Table Information</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>Indoor tables: 1-20</li>
                  <li>Outdoor tables: 21-40</li>
                  <li>Reservation duration: 2 hours</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-lg font-bold border-b pb-2 text-[var(--color-primary)]">คำแนะนำภาษาไทย</h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-bold text-gray-800">การสร้างการจอง</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>คลิกที่ช่องเวลาว่างในมุมมองปฏิทินหรือไทม์ไลน์</li>
                  <li>กรอกชื่อแขก จำนวนคน และเบอร์โทรติดต่อ</li>
                  <li>เลือกพื้นที่โต๊ะ (ในร้านหรือนอกร้าน) และโต๊ะที่ต้องการ</li>
                  <li>เพิ่มหมายเหตุพิเศษหากต้องการ</li>
                  <li>คลิก "สร้างการจอง" เพื่อยืนยัน</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">การแก้ไขการจอง</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>คลิกที่การจองที่มีอยู่</li>
                  <li>แก้ไขรายละเอียดตามต้องการ</li>
                  <li>คลิก "อัปเดตการจอง" เพื่อบันทึกการเปลี่ยนแปลง</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">การยกเลิกการจอง</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>คลิกที่การจองที่ต้องการยกเลิก</li>
                  <li>คลิกปุ่ม "ยกเลิกการจอง"</li>
                  <li>ยืนยันการยกเลิก</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">ตัวเลือกการแสดงผล</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>ปฏิทิน: ดูการจองทั้งหมดจัดเรียงตามวันที่</li>
                  <li>ไทม์ไลน์: ดูการจองในรูปแบบตารางเวลา</li>
                  <li>รายการ: เรียกดูการจองทั้งหมดในรูปแบบรายการง่ายๆ</li>
                  <li>7 วัน: ดูการจองทั้งหมดสำหรับสัปดาห์หน้าจัดกลุ่มตามวันที่</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">สัญลักษณ์บนปฏิทิน</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>จุดสีเขียว: การจอง 1-2 รายการ</li>
                  <li>จุดสีเหลืองอำพัน: การจอง 3-5 รายการ</li>
                  <li>จุดสีแดง: การจอง 6+ รายการ (วันที่มีลูกค้าเยอะ)</li>
                  <li>จุดสีส้ม: มีการจองอย่างน้อยหนึ่งรายการที่ยังไม่ได้กำหนดโต๊ะ</li>
                  <li>สัญลักษณ์สีน้ำเงิน (มุมบนขวา): วันหยุดราชการของเยอรมนี</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800">ข้อมูลโต๊ะ</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>โต๊ะในร้าน: 1-20</li>
                  <li>โต๊ะนอกร้าน: 21-40</li>
                  <li>ระยะเวลาการจอง: 2 ชั่วโมง</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
          >
            Close / ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

