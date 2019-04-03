export const createPermalink=(str)=>{
    // replaces dashes with underscores, then replace spaces with dashes
    return str.replace(/-+/g, '_').replace(/\s+/g, '-').toLowerCase();
};

export const createParam=(permalink)=>{
    // replaces dashes with spaces, then replace underscores with dashes
    return permalink.replace(/-+/g, ' ').replace(/_+/g, '-');
};

export const fixDisplayName=(str)=>{
    // remove spaces, then replace dashes with underscores
    return str.replace(/\s+/g, '').replace(/-+/g, '_');
};

export const getIp = async ()=>{
    return new Promise(r=>{var w=window,a=new (w.RTCPeerConnection||w.mozRTCPeerConnection||w.webkitRTCPeerConnection)({iceServers:[]}),b=()=>{};a.createDataChannel("");a.createOffer(c=>a.setLocalDescription(c,b,b),b);a.onicecandidate=c=>{try{c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)}catch(e){}}})
};