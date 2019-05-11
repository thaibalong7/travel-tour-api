
const company_info = require('../../config/setting').company_info

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const html_verify_email = (linkVerify, linkTeam) => {
	return `<!doctype html>
    <html>
    
    <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Verify Email</title>
      <style>
        /* -------------------------------------
              GLOBAL RESETS
          ------------------------------------- */
    
        /*All the styling goes here*/
    
        img {
          border: none;
          -ms-interpolation-mode: bicubic;
          max-width: 100%;
        }
    
        body {
          background-color: #f6f6f6;
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
    
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%;
        }
    
        table td {
          font-family: sans-serif;
          font-size: 14px;
          vertical-align: top;
        }
    
        /* -------------------------------------
              BODY & CONTAINER
          ------------------------------------- */
    
        .body {
          background-color: #f6f6f6;
          width: 100%;
        }
    
        /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
        .container {
          display: block;
          margin: 0 auto !important;
          /* makes it centered */
          max-width: 580px;
          padding: 10px;
          width: 580px;
        }
    
        /* This should also be a block element, so that it will fill 100% of the .container */
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 580px;
          padding: 10px;
        }
    
        /* -------------------------------------
              HEADER, FOOTER, MAIN
          ------------------------------------- */
        .main {
          background: #ffffff;
          border-radius: 3px;
          width: 100%;
        }
    
        .wrapper {
          box-sizing: border-box;
          padding: 20px;
        }
    
        .content-block {
          padding-bottom: 10px;
          padding-top: 10px;
        }
    
        .footer {
          clear: both;
          margin-top: 10px;
          text-align: center;
          width: 100%;
        }
    
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #999999;
          font-size: 12px;
          text-align: center;
        }
    
        /* -------------------------------------
              TYPOGRAPHY
          ------------------------------------- */
        h1,
        h2,
        h3,
        h4 {
          color: #000000;
          font-family: sans-serif;
          font-weight: 400;
          line-height: 1.4;
          margin: 0;
          margin-bottom: 30px;
        }
    
        h1 {
          font-size: 35px;
          font-weight: 300;
          text-align: center;
          text-transform: capitalize;
        }
    
        p,
        ul,
        ol {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 15px;
        }
    
        p li,
        ul li,
        ol li {
          list-style-position: inside;
          margin-left: 5px;
        }
    
        a {
          color: #3498db;
          text-decoration: underline;
        }
    
        /* -------------------------------------
              BUTTONS
          ------------------------------------- */
        .btn {
          box-sizing: border-box;
          width: 100%;
        }
    
        .btn>tbody>tr>td {
          padding-bottom: 15px;
        }
    
        .btn table {
          width: auto;
        }
    
        .btn table td {
          background-color: #ffffff;
          border-radius: 5px;
          text-align: center;
        }
    
        .btn a {
          background-color: #ffffff;
          border: solid 1px #3498db;
          border-radius: 5px;
          box-sizing: border-box;
          color: #3498db;
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          padding: 12px 25px;
          text-decoration: none;
          text-transform: capitalize;
        }
    
        .btn-primary table td {
          background-color: #3498db;
        }
    
        .btn-primary a {
          background-color: #3498db;
          border-color: #3498db;
          color: #ffffff;
        }
    
        /* -------------------------------------
              OTHER STYLES THAT MIGHT BE USEFUL
          ------------------------------------- */
        .last {
          margin-bottom: 0;
        }
    
        .first {
          margin-top: 0;
        }
    
        .align-center {
          text-align: center;
        }
    
        .align-right {
          text-align: right;
        }
    
        .align-left {
          text-align: left;
        }
    
        .clear {
          clear: both;
        }
    
        .mt0 {
          margin-top: 0;
        }
    
        .mb0 {
          margin-bottom: 0;
        }
    
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0;
        }
    
        .powered-by a {
          text-decoration: none;
        }
    
        hr {
          border: 0;
          border-bottom: 1px solid #f6f6f6;
          margin: 20px 0;
        }
    
        /* -------------------------------------
              RESPONSIVE AND MOBILE FRIENDLY STYLES
          ------------------------------------- */
        @media only screen and (max-width: 620px) {
          table[class=body] h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important;
          }
    
          table[class=body] p,
          table[class=body] ul,
          table[class=body] ol,
          table[class=body] td,
          table[class=body] span,
          table[class=body] a {
            font-size: 16px !important;
          }
    
          table[class=body] .wrapper,
          table[class=body] .article {
            padding: 10px !important;
          }
    
          table[class=body] .content {
            padding: 0 !important;
          }
    
          table[class=body] .container {
            padding: 0 !important;
            width: 100% !important;
          }
    
          table[class=body] .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
    
          table[class=body] .btn table {
            width: 100% !important;
          }
    
          table[class=body] .btn a {
            width: 100% !important;
          }
    
          table[class=body] .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important;
          }
        }
    
        /* -------------------------------------
              PRESERVE THESE STYLES IN THE HEAD
          ------------------------------------- */
        @media all {
          .ExternalClass {
            width: 100%;
          }
    
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
    
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
    
          .btn-primary table td:hover {
            background-color: #34495e !important;
          }
    
          .btn-primary a:hover {
            background-color: #34495e !important;
            border-color: #34495e !important;
          }
        }
      </style>
    </head>
    
    <body class="">
      <span class="preheader">Please click a button to verify your Email</span>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
          <td>&nbsp;</td>
          <td class="container">
            <div class="content">
    
              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" class="main">
    
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p>Hi there,</p>
                          <p>We are glad you are here. Please click a button to verify your Email!</p>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                            <tbody>
                              <tr>
                                <td align="left">
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tbody>
                                      <tr>
                                        <td> <a href="${linkVerify}" target="_blank">Verify</a> </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p>We just want to confirm that you have just registered a ${company_info.name} account</p>
                          <p>If you don't create any account, just delete this email and everything will return as if nothing happened.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
    
                <!-- END MAIN CONTENT AREA -->
              </table>
              <!-- END CENTERED WHITE CONTAINER -->
    
              <!-- START FOOTER -->
              <div class="footer">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-block powered-by">
                      Powered by <a href="${linkTeam}">${company_info.name} Team</a>.
                    </td>
                  </tr>
                </table>
              </div>
              <!-- END FOOTER -->
    
            </div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body> 
    </html>`
}

const html_forgetPassword_email = (new_password, linkTeam) => {
	return `<!doctype html>
    <html>
    
    <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Forget Password Email</title>
      <style>
        /* -------------------------------------
              GLOBAL RESETS
          ------------------------------------- */
    
        /*All the styling goes here*/
    
        img {
          border: none;
          -ms-interpolation-mode: bicubic;
          max-width: 100%;
        }
    
        body {
          background-color: #f6f6f6;
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
    
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%;
        }
    
        table td {
          font-family: sans-serif;
          font-size: 14px;
          vertical-align: top;
        }
    
        /* -------------------------------------
              BODY & CONTAINER
          ------------------------------------- */
    
        .body {
          background-color: #f6f6f6;
          width: 100%;
        }
    
        /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
        .container {
          display: block;
          margin: 0 auto !important;
          /* makes it centered */
          max-width: 580px;
          padding: 10px;
          width: 580px;
        }
    
        /* This should also be a block element, so that it will fill 100% of the .container */
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 580px;
          padding: 10px;
        }
    
        /* -------------------------------------
              HEADER, FOOTER, MAIN
          ------------------------------------- */
        .main {
          background: #ffffff;
          border-radius: 3px;
          width: 100%;
        }
    
        .wrapper {
          box-sizing: border-box;
          padding: 20px;
        }
    
        .content-block {
          padding-bottom: 10px;
          padding-top: 10px;
        }
    
        .footer {
          clear: both;
          margin-top: 10px;
          text-align: center;
          width: 100%;
        }
    
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #999999;
          font-size: 12px;
          text-align: center;
        }
    
        /* -------------------------------------
              TYPOGRAPHY
          ------------------------------------- */
        h1,
        h2,
        h3,
        h4 {
          color: #000000;
          font-family: sans-serif;
          font-weight: 400;
          line-height: 1.4;
          margin: 0;
          margin-bottom: 30px;
        }
    
        h1 {
          font-size: 35px;
          font-weight: 300;
          text-align: center;
          text-transform: capitalize;
        }
    
        p,
        ul,
        ol {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 15px;
        }
    
        p li,
        ul li,
        ol li {
          list-style-position: inside;
          margin-left: 5px;
        }
    
        a {
          color: #3498db;
          text-decoration: underline;
        }
    
        /* -------------------------------------
              BUTTONS
          ------------------------------------- */
        .btn {
          box-sizing: border-box;
          width: 100%;
        }
    
        .btn>tbody>tr>td {
          padding-bottom: 15px;
        }
    
        .btn table {
          width: auto;
        }
    
        .btn table td {
          background-color: #ffffff;
          border-radius: 5px;
          text-align: center;
        }
    
        .btn a {
          background-color: #ffffff;
          border: solid 1px #3498db;
          border-radius: 5px;
          box-sizing: border-box;
          color: #3498db;
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          padding: 12px 25px;
          text-decoration: none;
          text-transform: capitalize;
        }
    
        .btn-primary table td {
          background-color: #3498db;
        }
    
        .btn-primary a {
          background-color: #3498db;
          border-color: #3498db;
          color: #ffffff;
        }
    
        /* -------------------------------------
              OTHER STYLES THAT MIGHT BE USEFUL
          ------------------------------------- */
        .last {
          margin-bottom: 0;
        }
    
        .first {
          margin-top: 0;
        }
    
        .align-center {
          text-align: center;
        }
    
        .align-right {
          text-align: right;
        }
    
        .align-left {
          text-align: left;
        }
    
        .clear {
          clear: both;
        }
    
        .mt0 {
          margin-top: 0;
        }
    
        .mb0 {
          margin-bottom: 0;
        }
    
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0;
        }
    
        .powered-by a {
          text-decoration: none;
        }
    
        hr {
          border: 0;
          border-bottom: 1px solid #f6f6f6;
          margin: 20px 0;
        }
    
        /* -------------------------------------
              RESPONSIVE AND MOBILE FRIENDLY STYLES
          ------------------------------------- */
        @media only screen and (max-width: 620px) {
          table[class=body] h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important;
          }
    
          table[class=body] p,
          table[class=body] ul,
          table[class=body] ol,
          table[class=body] td,
          table[class=body] span,
          table[class=body] a {
            font-size: 16px !important;
          }
    
          table[class=body] .wrapper,
          table[class=body] .article {
            padding: 10px !important;
          }
    
          table[class=body] .content {
            padding: 0 !important;
          }
    
          table[class=body] .container {
            padding: 0 !important;
            width: 100% !important;
          }
    
          table[class=body] .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
    
          table[class=body] .btn table {
            width: 100% !important;
          }
    
          table[class=body] .btn a {
            width: 100% !important;
          }
    
          table[class=body] .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important;
          }
        }
    
        /* -------------------------------------
              PRESERVE THESE STYLES IN THE HEAD
          ------------------------------------- */
        @media all {
          .ExternalClass {
            width: 100%;
          }
    
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
    
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
    
          .btn-primary table td:hover {
            background-color: #34495e !important;
          }
    
          .btn-primary a:hover {
            background-color: #34495e !important;
            border-color: #34495e !important;
          }
        }
      </style>
    </head>
    
    <body class="">
      <span class="preheader">New password in ${company_info.name}</span>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
          <td>&nbsp;</td>
          <td class="container">
            <div class="content">
    
              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" class="main">
    
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p>Hi there,</p>
                          <p>It seems that you have just sent a request to reset your password.</p>                      
                          <p>This is your new password: <b>${new_password}</b></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
    
                <!-- END MAIN CONTENT AREA -->
              </table>
              <!-- END CENTERED WHITE CONTAINER -->
    
              <!-- START FOOTER -->
              <div class="footer">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-block powered-by">
                      Powered by <a href="${linkTeam}">${company_info.name} Team</a>.
                    </td>
                  </tr>
                </table>
              </div>
              <!-- END FOOTER -->
    
            </div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
    
    </html>`
}

const arr_days_of_week = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba',
	'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

const html_e_ticket = (linkTeam, book_tour, linkTourTurn) => {
	let html_list_passenger = ``;
	for (let i = 0; i < book_tour.passengers.length; i++) {
		const birthdate = new Date(book_tour.passengers[i].birthdate);
		var month = (birthdate.getMonth() + 1);
		var day = (birthdate.getDate());
		var year = (birthdate.getFullYear());
		html_list_passenger += `<tr>
		<td>
		${ (i + 1) + `.`}
		</td>
		<td class="name">
			${book_tour.passengers[i].fullname}
		</td>
		<td>
		${book_tour.passengers[i].sex === 'male' ? `Nam` : `Nữ`}
		</td>
		<td>
		${day + `/` + month + `/` + year}
		</td>
		<td>
		${book_tour.passengers[i].type_passenger.name_vi}
		</td>
		</tr>`

	}

	const date_arrive = new Date(book_tour.tour_turn.start_date)
	const time_arrive = new Date('01/01/2011 ' + book_tour.tour_turn.tour.routes[0].arrive_time)
	var ampm = time_arrive.getHours() >= 12 ? 'PM' : 'AM';
	let hour_arrive_time = time_arrive.getHours();
	if (hour_arrive_time < 10) hour_arrive_time = '0' + hour_arrive_time
	let min_arrive_time = time_arrive.getMinutes();
	if (min_arrive_time < 10) min_arrive_time = '0' + min_arrive_time
	const time_arrive_string = hour_arrive_time + ':' + min_arrive_time + ' ' + ampm + ' ' + arr_days_of_week[date_arrive.getDay()] + ', ' + date_arrive.getDate() + ' Thg ' + (date_arrive.getMonth() + 1) + ' ' + date_arrive.getFullYear();

	const start_at = 'Khởi hành tại ' + book_tour.tour_turn.tour.routes[0].location.name;

	return `<!doctype html>
	<html>
	
	<head>
		<meta name="viewport" content="width=device-width" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Simple Transactional Email</title>
		<style>
			/* -------------------------------------
			  GLOBAL RESETS
		  ------------------------------------- */
	
			/*All the styling goes here*/
	
			img {
				border: none;
				-ms-interpolation-mode: bicubic;
				max-width: 100%;
			}
	
			body {
				background-color: #f6f6f6;
				font-family: sans-serif;
				-webkit-font-smoothing: antialiased;
				font-size: 14px;
				line-height: 1.4;
				margin: 0;
				padding: 0;
				-ms-text-size-adjust: 100%;
				-webkit-text-size-adjust: 100%;
			}
	
			table {
				border-collapse: separate;
				mso-table-lspace: 0pt;
				mso-table-rspace: 0pt;
				width: 100%;
			}
	
			table td {
				font-family: sans-serif;
				font-size: 14px;
				vertical-align: top;
			}
	
			/* -------------------------------------
			  BODY & CONTAINER
		  ------------------------------------- */
	
			.body {
				background-color: #f6f6f6;
				width: 100%;
			}
	
			/* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
			.container {
				display: block;
				margin: 0 auto !important;
				/* makes it centered */
				max-width: 580px;
				padding: 10px;
				width: 580px;
			}
	
			/* This should also be a block element, so that it will fill 100% of the .container */
			.content {
				box-sizing: border-box;
				display: block;
				margin: 0 auto;
				max-width: 580px;
				padding: 10px;
			}
	
			/* -------------------------------------
			  HEADER, FOOTER, MAIN
		  ------------------------------------- */
			.main {
				background: #ffffff;
				border-radius: 3px;
				width: 100%;
			}
	
			.wrapper {
				box-sizing: border-box;
				padding: 20px;
			}
	
			.content-block {
				padding-bottom: 10px;
				padding-top: 10px;
			}
	
			.footer {
				clear: both;
				margin-top: 10px;
				text-align: center;
				width: 100%;
			}
	
			.footer td,
			.footer p,
			.footer span,
			.footer a {
				color: #999999;
				font-size: 12px;
				text-align: center;
			}
	
			/* -------------------------------------
			  TYPOGRAPHY
		  ------------------------------------- */
			h1,
			h2,
			h3,
			h4 {
				color: #000000;
				font-family: sans-serif;
				font-weight: 400;
				line-height: 1.4;
				margin: 0;
				margin-bottom: 30px;
			}
	
			h1 {
				font-size: 35px;
				font-weight: 300;
				text-align: center;
				text-transform: capitalize;
			}
	
			p,
			ul,
			ol {
				font-family: sans-serif;
				font-size: 14px;
				font-weight: normal;
				margin: 0;
				margin-bottom: 15px;
			}
	
			p li,
			ul li,
			ol li {
				list-style-position: inside;
				margin-left: 5px;
			}
	
			a {
				color: #3498db;
				text-decoration: underline;
			}
	
			/* -------------------------------------
			  BUTTONS
		  ------------------------------------- */
			.btn {
				box-sizing: border-box;
				width: 100%;
			}
	
			.btn>tbody>tr>td {
				padding-bottom: 15px;
			}
	
			.btn table {
				width: auto;
			}
	
			.btn table td {
				background-color: #ffffff;
				border-radius: 5px;
				text-align: center;
			}
	
			.btn a {
				background-color: #ffffff;
				border: solid 1px #3498db;
				border-radius: 5px;
				box-sizing: border-box;
				color: #3498db;
				cursor: pointer;
				display: inline-block;
				font-size: 14px;
				font-weight: bold;
				margin: 0;
				padding: 12px 25px;
				text-decoration: none;
				text-transform: capitalize;
			}
	
			.btn-primary table td {
				background-color: #3498db;
			}
	
			.btn-primary a {
				background-color: #3498db;
				border-color: #3498db;
				color: #ffffff;
			}
	
			/* -------------------------------------
			  OTHER STYLES THAT MIGHT BE USEFUL
		  ------------------------------------- */
			.last {
				margin-bottom: 0;
			}
	
			.first {
				margin-top: 0;
			}
	
			.align-center {
				text-align: center;
			}
	
			.text-bold {
				font-weight: bold;
			}
	
			.align-right {
				text-align: right;
			}
	
			.text-margin-request {
				margin-top: 20px;
			}
	
			.text-info-tour {
				font-weight: bold;
				color: cornflowerblue;
				margin-top: 25px;
				text-transform: uppercase;
			}
	
			.align-left {
				text-align: left;
			}
	
			.clear {
				clear: both;
			}
	
			.mt0 {
				margin-top: 0;
			}
	
			.mb0 {
				margin-bottom: 0;
			}
	
			.preheader {
				color: transparent;
				display: none;
				height: 0;
				max-height: 0;
				max-width: 0;
				opacity: 0;
				overflow: hidden;
				mso-hide: all;
				visibility: hidden;
				width: 0;
			}
	
			.powered-by a {
				text-decoration: none;
			}
	
			.left-table {
				float: left;
				font-weight: bold;
				margin-left: 0;
				width: 140px;
			}
	
			.right-table {
				font-weight: bold;
				text-transform: capitalize;
				font-size: 120%
			}
	
			.code-ticket {
				font-weight: bold;
				font-size: 23px;
				color: cornflowerblue
			}
	
			.text-note {
				margin-top: 20px;
				font-size: 90%;
				font-style: italic;
				font-weight: bold;
				color: rgba(43, 42, 42, 0.829);
			}
	
			hr {
				margin-top: 15px;
				height: 1.8px;
				border: none;
				color: rgba(2, 2, 2, 0.63);
				background-color: rgba(51, 43, 43, 0.589);
			}
	
			.info-contact-head {
				margin-top: 25px;
				font-weight: bold;
			}
	
			.info-passenger-head {
				margin-top: 25px;
				font-weight: bold;
			}
	
			.table-passenger {
				margin-top: 15px;
			}
	
			.table-passenger .name {
				font-weight: bold;
			}
	
			.end-mail {
				text-align: center;
				padding-left: 50px;
				padding-right: 50px;
				padding-top: 60px
			}
	
			/* -------------------------------------
			  RESPONSIVE AND MOBILE FRIENDLY STYLES
		  ------------------------------------- */
			@media only screen and (max-width: 620px) {
				table[class=body] h1 {
					font-size: 28px !important;
					margin-bottom: 10px !important;
				}
	
				table[class=body] p,
				table[class=body] ul,
				table[class=body] ol,
				table[class=body] td,
				table[class=body] span,
				table[class=body] a {
					font-size: 16px !important;
				}
	
				table[class=body] .wrapper,
				table[class=body] .article {
					padding: 10px !important;
				}
	
				table[class=body] .content {
					padding: 0 !important;
				}
	
				table[class=body] .container {
					padding: 0 !important;
					width: 100% !important;
				}
	
				table[class=body] .main {
					border-left-width: 0 !important;
					border-radius: 0 !important;
					border-right-width: 0 !important;
				}
	
				table[class=body] .btn table {
					width: 100% !important;
				}
	
				table[class=body] .btn a {
					width: 100% !important;
				}
	
				table[class=body] .img-responsive {
					height: auto !important;
					max-width: 100% !important;
					width: auto !important;
				}
			}
	
			/* -------------------------------------
			  PRESERVE THESE STYLES IN THE HEAD
		  ------------------------------------- */
			@media all {
				.ExternalClass {
					width: 100%;
				}
	
				.ExternalClass,
				.ExternalClass p,
				.ExternalClass span,
				.ExternalClass font,
				.ExternalClass td,
				.ExternalClass div {
					line-height: 100%;
				}
	
				.apple-link a {
					color: inherit !important;
					font-family: inherit !important;
					font-size: inherit !important;
					font-weight: inherit !important;
					line-height: inherit !important;
					text-decoration: none !important;
				}
	
				.btn-primary table td:hover {
					background-color: #34495e !important;
				}
	
				.btn-primary a:hover {
					background-color: #34495e !important;
					border-color: #34495e !important;
				}
			}
		</style>
	</head>
	
	<body class="">
		<span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
		<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
			<tr>
				<td>&nbsp;</td>
				<td class="container">
					<div class="content">
	
						<!-- START CENTERED WHITE CONTAINER -->
						<table role="presentation" class="main">
	
							<!-- START MAIN CONTENT AREA -->
							<tr>
								<td class="wrapper">
									<table role="presentation" border="0" cellpadding="0" cellspacing="0">
										<tr>
											<td>
												<h2 class="align-center">Vé điện tử của quý khách!</h2>
												<div class="text-bold">Kính gởi quý khách ${book_tour.book_tour_contact_info.fullname},</div>
												<div class="text-margin-request">Yêu cầu đặt vé của quý khách đã được xác
													nhận thành công.</div>
												<a href="${linkTourTurn}">Tour đã đặt</a>
												<div class="text-info-tour">Thông tin đặt vé</div>
												<hr />
												<div>
													<span class="left-table">Tên tour</span>
													<span class="right-table">${book_tour.tour_turn.tour.name}</span>
												</div>
												<hr />
												<div>
													<span class="left-table">
														<span style="font-weight: normal">Mã đặt vé (PNR): </span>
														<span class="code-ticket">${book_tour.code}</span>
													</span>
													<div class="right-table">
														<span>${time_arrive_string}</span>
														<div style="font-weight: normal;font-size: 90%">${start_at}</div>
													</div>
												</div>
												<br />
												<div class="text-note">
													*Quý khách vui lòng đến sớm 40 phút để chuẩn bị khởi hành
												</div>
												<hr />
												<div>
													<div class="info-contact-head">Thông tin người đặt: </div>
													<table class="table-passenger">
														<tr>
															<td>
																Tên:
															</td>
															<td class="name">
																${book_tour.book_tour_contact_info.fullname}
															</td>
														</tr>
														<tr>
															<td>
																Email:
															</td>
															<td>
																${book_tour.book_tour_contact_info.email}
															</td>
														</tr>
														<tr>
															<td>
																Điện thoại:
															</td>
															<td>
																${book_tour.book_tour_contact_info.phone}
															</td>
														</tr>
														<tr>
															<td>
																Địa chỉ:
															</td>
															<td>
																${book_tour.book_tour_contact_info.address}
															</td>
														</tr>
													</table>
												</div>
												<hr />
												<div>
													<div class="info-passenger-head">Thông tin hành khách: </div>
													<table class="table-passenger">
														${html_list_passenger}
													</table>
												</div>
											</td>
										</tr>
									</table>
									<div class="end-mail">
										Email này được gởi tới quý khách ${book_tour.book_tour_contact_info.fullname} vì quý khách đã đặt tour du lịch qua ${company_info.name}.
									</div>
	
								</td>
							</tr>
	
							<!-- END MAIN CONTENT AREA -->
						</table>
						<!-- END CENTERED WHITE CONTAINER -->
	
						<!-- START FOOTER -->
						<div class="footer">
							<table role="presentation" border="0" cellpadding="0" cellspacing="0">
								<tr>
									<td class="content-block powered-by">
										Powered by <a href="${linkTeam}">${company_info.name} Team</a>.
									</td>
								</tr>
							</table>
						</div>
						<!-- END FOOTER -->
	
					</div>
				</td>
				<td>&nbsp;</td>
			</tr>
		</table>
	</body>
	
	</html>`
}

const html_confirm_cancel_email = (linkTeam, cancel_booking) => {
	let html_list_passenger = ``;
	for (let i = 0; i < cancel_booking.book_tour_history.passengers.length; i++) {
		const birthdate = new Date(cancel_booking.book_tour_history.passengers[i].birthdate);
		var month = (birthdate.getMonth() + 1);
		var day = (birthdate.getDate());
		var year = (birthdate.getFullYear());
		html_list_passenger += `<tr>
		<td>
		${ (i + 1) + `.`}
		</td>
		<td class="name">
			${cancel_booking.book_tour_history.passengers[i].fullname}
		</td>
		<td>
		${cancel_booking.book_tour_history.passengers[i].sex === 'male' ? `Nam` : `Nữ`}
		</td>
		<td>
		${day + `/` + month + `/` + year}
		</td>
		<td>
		${cancel_booking.book_tour_history.passengers[i].type_passenger.name_vi}
		</td>
		</tr>`

	}

	const date_arrive = new Date(cancel_booking.book_tour_history.tour_turn.start_date)
	const time_arrive = new Date('01/01/2011 ' + cancel_booking.book_tour_history.tour_turn.tour.routes[0].arrive_time)
	var ampm = time_arrive.getHours() >= 12 ? 'PM' : 'AM';
	let hour_arrive_time = time_arrive.getHours();
	if (hour_arrive_time < 10) hour_arrive_time = '0' + hour_arrive_time
	let min_arrive_time = time_arrive.getMinutes();
	if (min_arrive_time < 10) min_arrive_time = '0' + min_arrive_time
	const time_arrive_string = hour_arrive_time + ':' + min_arrive_time + ' ' + ampm + ' ' + arr_days_of_week[date_arrive.getDay()] + ', ' + date_arrive.getDate() + ' Thg ' + (date_arrive.getMonth() + 1) + ' ' + date_arrive.getFullYear();

	const start_at = 'Khởi hành tại ' + cancel_booking.book_tour_history.tour_turn.tour.routes[0].location.name;

	const money_refunded = formatNumber(cancel_booking.money_refunded);

	const refund_period_date = new Date(cancel_booking.refund_period);
	const refund_period = arr_days_of_week[refund_period_date.getDay()] + ', ' + refund_period_date.getDate() + ' Thg ' + (refund_period_date.getMonth() + 1) + ' ' + refund_period_date.getFullYear();

	return `<!doctype html>
	<html>
	
	<head>
		<meta name="viewport" content="width=device-width" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Simple Transactional Email</title>
		<style>
			/* -------------------------------------
			  GLOBAL RESETS
		  ------------------------------------- */
	
			/*All the styling goes here*/
	
			img {
				border: none;
				-ms-interpolation-mode: bicubic;
				max-width: 100%;
			}
	
			body {
				background-color: #f6f6f6;
				font-family: sans-serif;
				-webkit-font-smoothing: antialiased;
				font-size: 14px;
				line-height: 1.4;
				margin: 0;
				padding: 0;
				-ms-text-size-adjust: 100%;
				-webkit-text-size-adjust: 100%;
			}
	
			table {
				border-collapse: separate;
				mso-table-lspace: 0pt;
				mso-table-rspace: 0pt;
				width: 100%;
			}
	
			table td {
				font-family: sans-serif;
				font-size: 14px;
				vertical-align: top;
			}
	
			/* -------------------------------------
			  BODY & CONTAINER
		  ------------------------------------- */
	
			.body {
				background-color: #f6f6f6;
				width: 100%;
			}
	
			/* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
			.container {
				display: block;
				margin: 0 auto !important;
				/* makes it centered */
				max-width: 580px;
				padding: 10px;
				width: 580px;
			}
	
			/* This should also be a block element, so that it will fill 100% of the .container */
			.content {
				box-sizing: border-box;
				display: block;
				margin: 0 auto;
				max-width: 580px;
				padding: 10px;
			}
	
			/* -------------------------------------
			  HEADER, FOOTER, MAIN
		  ------------------------------------- */
			.main {
				background: #ffffff;
				border-radius: 3px;
				width: 100%;
			}
	
			.wrapper {
				box-sizing: border-box;
				padding: 20px;
			}
	
			.content-block {
				padding-bottom: 10px;
				padding-top: 10px;
			}
	
			.footer {
				clear: both;
				margin-top: 10px;
				text-align: center;
				width: 100%;
			}
	
			.footer td,
			.footer p,
			.footer span,
			.footer a {
				color: #999999;
				font-size: 12px;
				text-align: center;
			}
	
			/* -------------------------------------
			  TYPOGRAPHY
		  ------------------------------------- */
			h1,
			h2,
			h3,
			h4 {
				color: #000000;
				font-family: sans-serif;
				font-weight: 400;
				line-height: 1.4;
				margin: 0;
				margin-bottom: 30px;
			}
	
			h1 {
				font-size: 35px;
				font-weight: 300;
				text-align: center;
				text-transform: capitalize;
			}
	
			p,
			ul,
			ol {
				font-family: sans-serif;
				font-size: 14px;
				font-weight: normal;
				margin: 0;
				margin-bottom: 15px;
			}
	
			p li,
			ul li,
			ol li {
				list-style-position: inside;
				margin-left: 5px;
			}
	
			a {
				color: #3498db;
				text-decoration: underline;
			}
	
			/* -------------------------------------
			  BUTTONS
		  ------------------------------------- */
			.btn {
				box-sizing: border-box;
				width: 100%;
			}
	
			.btn>tbody>tr>td {
				padding-bottom: 15px;
			}
	
			.btn table {
				width: auto;
			}
	
			.btn table td {
				background-color: #ffffff;
				border-radius: 5px;
				text-align: center;
			}
	
			.btn a {
				background-color: #ffffff;
				border: solid 1px #3498db;
				border-radius: 5px;
				box-sizing: border-box;
				color: #3498db;
				cursor: pointer;
				display: inline-block;
				font-size: 14px;
				font-weight: bold;
				margin: 0;
				padding: 12px 25px;
				text-decoration: none;
				text-transform: capitalize;
			}
	
			.btn-primary table td {
				background-color: #3498db;
			}
	
			.btn-primary a {
				background-color: #3498db;
				border-color: #3498db;
				color: #ffffff;
			}
	
			/* -------------------------------------
			  OTHER STYLES THAT MIGHT BE USEFUL
		  ------------------------------------- */
			.last {
				margin-bottom: 0;
			}
	
			.first {
				margin-top: 0;
			}
	
			.align-center {
				text-align: center;
			}
	
			.text-bold {
				font-weight: bold;
			}
	
			.align-right {
				text-align: right;
			}
	
			.text-margin-request {
				margin-top: 20px;
			}
	
			.text-info-tour {
				font-weight: bold;
				color: cornflowerblue;
				margin-top: 25px;
				text-transform: uppercase;
			}
	
			.align-left {
				text-align: left;
			}
	
			.clear {
				clear: both;
			}
	
			.mt0 {
				margin-top: 0;
			}
	
			.mb0 {
				margin-bottom: 0;
			}
	
			.preheader {
				color: transparent;
				display: none;
				height: 0;
				max-height: 0;
				max-width: 0;
				opacity: 0;
				overflow: hidden;
				mso-hide: all;
				visibility: hidden;
				width: 0;
			}
	
			.powered-by a {
				text-decoration: none;
			}
	
			.left-table {
				float: left;
				font-weight: bold;
				margin-left: 0;
				width: 140px;
			}
	
			.right-table {
				font-weight: bold;
				text-transform: capitalize;
				font-size: 120%
			}
	
			.code-ticket {
				font-weight: bold;
				font-size: 23px;
				color: cornflowerblue
			}
	
			.text-note {
				margin-top: 20px;
				font-size: 90%;
				font-style: italic;
				font-weight: bold;
				color: rgba(43, 42, 42, 0.829);
			}
	
			hr {
				margin-top: 15px;
				height: 1.8px;
				border: none;
				color: rgba(2, 2, 2, 0.63);
				background-color: rgba(51, 43, 43, 0.589);
			}
	
			.info-contact-head {
				margin-top: 25px;
				font-weight: bold;
			}
	
			.info-passenger-head {
				margin-top: 25px;
				font-weight: bold;
			}
	
			.table-passenger {
				margin-top: 15px;
			}
	
			.table-passenger .name {
				font-weight: bold;
			}

			.table-refund {
				margin-top: 15px
			}
	
			.end-mail {
				text-align: center;
				padding-left: 50px;
				padding-right: 50px;
				padding-top: 60px
			}
	
			/* -------------------------------------
			  RESPONSIVE AND MOBILE FRIENDLY STYLES
		  ------------------------------------- */
			@media only screen and (max-width: 620px) {
				table[class=body] h1 {
					font-size: 28px !important;
					margin-bottom: 10px !important;
				}
	
				table[class=body] p,
				table[class=body] ul,
				table[class=body] ol,
				table[class=body] td,
				table[class=body] span,
				table[class=body] a {
					font-size: 16px !important;
				}
	
				table[class=body] .wrapper,
				table[class=body] .article {
					padding: 10px !important;
				}
	
				table[class=body] .content {
					padding: 0 !important;
				}
	
				table[class=body] .container {
					padding: 0 !important;
					width: 100% !important;
				}
	
				table[class=body] .main {
					border-left-width: 0 !important;
					border-radius: 0 !important;
					border-right-width: 0 !important;
				}
	
				table[class=body] .btn table {
					width: 100% !important;
				}
	
				table[class=body] .btn a {
					width: 100% !important;
				}
	
				table[class=body] .img-responsive {
					height: auto !important;
					max-width: 100% !important;
					width: auto !important;
				}
			}
	
			/* -------------------------------------
			  PRESERVE THESE STYLES IN THE HEAD
		  ------------------------------------- */
			@media all {
				.ExternalClass {
					width: 100%;
				}
	
				.ExternalClass,
				.ExternalClass p,
				.ExternalClass span,
				.ExternalClass font,
				.ExternalClass td,
				.ExternalClass div {
					line-height: 100%;
				}
	
				.apple-link a {
					color: inherit !important;
					font-family: inherit !important;
					font-size: inherit !important;
					font-weight: inherit !important;
					line-height: inherit !important;
					text-decoration: none !important;
				}
	
				.btn-primary table td:hover {
					background-color: #34495e !important;
				}
	
				.btn-primary a:hover {
					background-color: #34495e !important;
					border-color: #34495e !important;
				}
			}
		</style>
	</head>
	
	<body class="">
		<span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
		<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
			<tr>
				<td>&nbsp;</td>
				<td class="container">
					<div class="content">
	
						<!-- START CENTERED WHITE CONTAINER -->
						<table role="presentation" class="main">
	
							<!-- START MAIN CONTENT AREA -->
							<tr>
								<td class="wrapper">
									<table role="presentation" border="0" cellpadding="0" cellspacing="0">
										<tr>
											<td>
												<h2 class="align-center">Thông báo hoàn tiền</h2>
												<div class="text-bold">Kính gởi quý khách ${cancel_booking.book_tour_history.book_tour_contact_info.fullname},</div>
												<div class="text-margin-request">Yêu cầu hủy vé của quý khách đã được
                        xác nhận. Dưới đâu là thông tin hoàn tiền cho quý khách:</div>
                        <table class="table-refund">
                          <tr>
                            <td>
                                Số tiền được hoàn trả:
                            </td>
                            <td style="font-weight: bold">
                                ${money_refunded} VNĐ
                            </td>
                          </tr>
                          <tr>
                            <td>
                                Thời hạn nhận:
                            </td>
                            <td>
                                ${refund_period}
                            </td>
                          </tr>
                          <tr>
                            <td>
                                Nơi nhận:
                            </td>
                            <td>
                                ${company_info.address}
                            </td>
                          </tr>
                        </table>
                        <div style="margin-top: 15px">
                        Quý khách vui lòng đến đúng địa điểm theo đúng thời hạn quy định ở trên.
                        Nếu không quý khách sẽ <span style="font-weight: bold">không</span> được hoàn tiền theo chính sách của công
                        ty.
                    </div>
                    <div style="margin-top: 10px">Nếu quý khách muốn thay đổi thời hạn nhận tiền, vui lòng liên hệ cho công ty.</div>
												<div class="text-info-tour">Thông tin vé</div>
												<hr />
												<div>
													<span class="left-table">Tên tour</span>
													<span class="right-table">${cancel_booking.book_tour_history.tour_turn.tour.name}</span>
												</div>
												<hr />
												<div>
													<span class="left-table">
														<span style="font-weight: normal">Mã đặt vé (PNR): </span>
														<span class="code-ticket">${cancel_booking.book_tour_history.code}</span>
													</span>
													<div class="right-table">
														<span>${time_arrive_string}</span>
														<div style="font-weight: normal;font-size: 90%">${start_at}</div>
													</div>
												</div>
												<br />
												<hr />
												<div>
													<div class="info-contact-head">Thông tin người đặt: </div>
													<table class="table-passenger">
														<tr>
															<td>
																Tên:
															</td>
															<td class="name">
																${cancel_booking.book_tour_history.book_tour_contact_info.fullname}
															</td>
														</tr>
														<tr>
															<td>
																Email:
															</td>
															<td>
																${cancel_booking.book_tour_history.book_tour_contact_info.email}
															</td>
														</tr>
														<tr>
															<td>
																Điện thoại:
															</td>
															<td>
																${cancel_booking.book_tour_history.book_tour_contact_info.phone}
															</td>
														</tr>
														<tr>
															<td>
																Địa chỉ:
															</td>
															<td>
																${cancel_booking.book_tour_history.book_tour_contact_info.address}
															</td>
														</tr>
													</table>
												</div>
												<hr />
												<div>
													<div class="info-passenger-head">Thông tin hành khách: </div>
													<table class="table-passenger">
														${html_list_passenger}
													</table>
												</div>
											</td>
										</tr>
									</table>
									<div class="end-mail">
										Email này được gởi tới quý khách ${cancel_booking.book_tour_history.book_tour_contact_info.fullname} vì quý khách đã yêu cầu với ${company_info.name} hủy vé sau khi đã thanh toán.
									</div>
	
								</td>
							</tr>
	
							<!-- END MAIN CONTENT AREA -->
						</table>
						<!-- END CENTERED WHITE CONTAINER -->
	
						<!-- START FOOTER -->
						<div class="footer">
							<table role="presentation" border="0" cellpadding="0" cellspacing="0">
								<tr>
									<td class="content-block powered-by">
										Powered by <a href="${linkTeam}">${company_info.name} Team</a>.
									</td>
								</tr>
							</table>
						</div>
						<!-- END FOOTER -->
	
					</div>
				</td>
				<td>&nbsp;</td>
			</tr>
		</table>
	</body>
	
	</html>`
}

module.exports = {
	html_verify_email,
	html_forgetPassword_email,
	html_e_ticket,
	html_confirm_cancel_email
}