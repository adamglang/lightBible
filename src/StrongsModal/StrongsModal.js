import React from "react";
import Modal from "react-responsive-modal";
import Fetch from "react-fetch-component";
import ModalContent from "./ModalContent";import {PropagateLoader} from 'react-spinners';


const StrongsModal = ({modalOpen, onCloseModal, strongsURL, setStrongsURL}) => (
  <Modal open={modalOpen} onClose={onCloseModal} center>
    <Fetch url={strongsURL}>
      {
        ({loading, error, data}) => (
          <div>
            {loading && <div className={"spinLoader"}><PropagateLoader color={"#333333"} className={"loader"}/></div>}
            {error && console.error(`Could not fetch from ${strongsURL}. Got ${error.stack}`)}
            {data && (<ModalContent {...data} setStrongsURL={setStrongsURL} className={"strongsModal"}/>)}
          </div>
        )
      }
    </Fetch>
  </Modal>
);

export default StrongsModal;